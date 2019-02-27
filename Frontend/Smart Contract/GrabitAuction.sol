/*
*/
pragma solidity ^0.4.23;
library SafeMath 
{
  function add(uint a, uint b) internal pure returns (uint) 
  {
    uint c;
    c = a + b;
    require(c >= a,"c >= a");
    return c;
  }
  
  function sub(uint a, uint b) internal pure returns (uint) 
  {
    require(b <= a, "b <= a");
    uint c;
    c = a - b;
    return c;
  }
  
  function mul(uint a, uint b) internal pure returns (uint) 
  {
    uint c;
    c = a * b;
    require(a == 0 || c / a == b,"a == 0 || c / a == b");
    return c;
  }
  
  function div(uint a, uint b) internal pure returns (uint) 
  {
    require(b > 0,"b > 0");
    uint c;
    c = a / b;
    return c;
  }
  
}
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public{
    owner = msg.sender;
  }
  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner,"Only owner");
    _;
  }
  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner{
    require(newOwner != address(0), "New owner should be a valid address");
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
contract Accounts is Ownable{
  // Token details
  string public constant name = "GRBT";
  string public constant symbol = "GRBT";
  uint8 public constant decimals = 1;
  using SafeMath for uint;
  event Mint(address indexed to, uint256 amount);
  event Transfer(address indexed from, address indexed to, uint256 value);
  uint256 public tokensMinted = 0;
  mapping(address => uint256) balances;
  
  /**
  * @dev Gets the balance of the specified address.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf() public view returns (uint256 accountbalance) {
    return balances[msg.sender];
  }  
  function transfer(address _to, uint256 _value) public returns(bool) {
    require(_to != address(0),"Invalid Address");
    require(_value <= balances[msg.sender],"No Balance");
    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }
  function mint(address _to, uint256 _tokens) public onlyOwner returns(bool) {
    /** Modified to handle multiple capped crowdsales */
    //uint256 amt = _amount * 1 ether;
    //_amount = _amount * 1 ether;
    //require(tokensMinted.add(amt) <= totalSupply);
    tokensMinted = tokensMinted.add(_tokens);
    //Zappelin Standard code 
    balances[_to] = balances[_to].add(_tokens);
    emit Mint(_to, _tokens);
    emit Transfer(0x0, _to, _tokens);
    return true;
  }
}
contract GrabItAuction is Ownable, Accounts
{
  using SafeMath for uint;
  //uint256 public decimals = 18;
  uint256 auctionID;
  struct auction{
    uint256[] times; //start time, end time , reg start time, reg end time
    uint256 basePrice;
    uint256 bidIncrement;
    uint256[] bidBounds; //min bid value, min bidders, promised min value, bidders promised
    address lastBidder;
    uint resetTime;
    uint status;
    uint256[] lastBidDetails; //last bid amt, last bid time
    address[] preRegisters;
    address[] overAllRegisters;
  }
  /*
    auction id, unique id, base price,bid increment, start, end,min bid, 
  last bid amt, last bid time, bidding interval, last bidder
   */
  mapping(uint256 => auction) _auctions;
  uint256[] _auctionList;
  
  struct bid{
    uint256 auctionID;
    uint256 amount;
  }
  
  struct pRegister{
    uint status;
    uint256 time;
    bool bidded;
    uint256 chances;
  }
  mapping(uint256 => mapping(address => bid)) _bids;
  mapping(uint256 => mapping(address => pRegister)) public preRegisterList;
  //mapping(address => uint256[]) public registredForAuction;
  event AuctionFinalized(uint256 auctionID, address winner, uint256 amount);
  event AuctionCreated(uint256 auctionID);
  
  event Bidding(address bidder,uint256 auctionID,uint256 amount, uint256 auctionEndTime);
  
  mapping(uint256 => bool) _canClone;
  mapping(uint256 => uint256) _cloneParent;
  
  constructor() public
  {
    // createAuction(now.add(520),now.add(1440),10000,100,100,20,now.add(1),now.add(240),1);
    // createAuction(now.add(720),now.add(1440),10000,100,100,20,now.add(1),now.add(520),4);
    mint(owner,100000);
  }
  function currentTime() public view returns(uint256){
    return now;
  }
  /**
  * @dev Option creation.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function createAuction(
    uint256 _startTime, uint256 _endTime, uint256 _basePrice,
    uint256 _bidIncrement,uint256 _minBid,uint _resetTime,
    uint256 _regStartTime, uint256 _regEndTime, uint256 minBidders) 
    public onlyOwner payable returns(uint256){
      
    require(_startTime > now, "Start should be > now");
    require(_endTime > _startTime, "End should be > Start");
    require(_basePrice > 0, "Base Price should be > 0");
    require(_bidIncrement > 0, "Bid Increment should be > 0");
    require(_minBid >= _bidIncrement, "Min Bid should be >= Bid increment");
    require(_resetTime > 0, "Bidding Interval should be > 0");
    require(_regStartTime > now, "Reg Start should be > now");
    require(_regEndTime > _regStartTime, "Reg End should be > Start");
    require(_regEndTime < _startTime, "Reg End should be < Start");
    auctionID = auctionID.add(1);
    _auctions[auctionID].times = [_startTime, _endTime, _regStartTime, _regEndTime];
    _auctions[auctionID].basePrice = _basePrice;
    _auctions[auctionID].bidIncrement = _bidIncrement;//.mul(1 ether);
    _auctions[auctionID].bidBounds = [_minBid, minBidders, 0, 0];
    _auctions[auctionID].resetTime = _resetTime;
    _auctions[auctionID].status = 0;
    _auctions[auctionID].lastBidDetails = [0,0];
    _auctionList.push(auctionID);
    
    _canClone[auctionID]=true;
    
    emit AuctionCreated(auctionID);
    return auctionID;
  }
  
  function canClone(uint256 _aId) public view returns(bool){
      return _canClone[_aId];
  }
  
  function cloneAuction(
    uint256 oldAID, uint256 _startTime, uint256 _endTime,
    uint256 _regStartTime, uint256 _regEndTime) 
    public onlyOwner payable returns(uint256){
      
    require(_auctions[oldAID].status == 1,"Auction not ended");
    require(_canClone[oldAID],"Auction clone exist");
    require(_startTime > now, "Start should be > now");
    require(_endTime > _startTime, "End should be > Start");
    require(_regStartTime > now, "Reg Start should be > now");
    require(_regEndTime > _regStartTime, "Reg End should be > Start");
    require(_regEndTime < _startTime, "Reg End should be < Start");
    auctionID = auctionID.add(1);
    _auctions[auctionID].times = [_startTime, _endTime, _regStartTime, _regEndTime];
    _auctions[auctionID].basePrice = _auctions[oldAID].basePrice;
    _auctions[auctionID].bidIncrement = _auctions[oldAID].bidIncrement;//.mul(1 ether);
    _auctions[auctionID].bidBounds = _auctions[oldAID].bidBounds;
    _auctions[auctionID].resetTime = _auctions[oldAID].resetTime;
    _auctions[auctionID].status = 0;
    _auctions[auctionID].lastBidDetails = [0,0];
    _auctionList.push(auctionID);
    
    _auctions[auctionID].bidBounds[2] = 0;
    _auctions[auctionID].bidBounds[3] = 0;
    
    _canClone[oldAID]=false;
    _cloneParent[auctionID]=oldAID;
    
    for(uint i = 0;i <_auctions[oldAID].overAllRegisters.length;i++){
      address a;
      a = _auctions[oldAID].overAllRegisters[i];
      if(preRegisterList[oldAID][a].chances <2){
        preRegisterList[oldAID][a].chances= preRegisterList[oldAID][a].chances.add(1);
        _register(auctionID, a, _auctions[auctionID].bidBounds[0]);
      }
    }
    emit AuctionCreated(auctionID);
    return auctionID;
  }
  function auctionDetails(uint256 _aID) public view 
    returns(uint256[] times,uint256 basePrice,uint256 bidIncrement,uint256[] bidBounds, 
    uint resetTime,uint256[] lastBidDetails,uint256 status)
  {
    return (
      _auctions[_aID].times,
      _auctions[_aID].basePrice,
      _auctions[_aID].bidIncrement,
      _auctions[_aID].bidBounds,
      _auctions[_aID].resetTime,
      _auctions[_aID].lastBidDetails,
      _auctions[_aID].status
      );
  }
  function bidDetails(uint256 _aID) public view 
    returns(uint256 amount)
  {
    return(
      _bids[_aID][msg.sender].amount
    );
  }
  function auctionList() public view returns(uint256[]){
    return _auctionList;
  }
  function PreRegister(uint256 _aID) public payable returns(bool){
    require(_aID > 0, "Auction ID should be > 0");
    require(_auctions[_aID].status == 0,"Auction ended");
    require(_auctions[_aID].times[0] > now, "Auction started");
    require(preRegisterList[_aID][msg.sender].status == 0, "Already registred");
    require(now > _auctions[_aID].times[2] && now < _auctions[_aID].times[3], "Reg time over");
    
    uint256 parentAId = _cloneParent[_aID];
    if(parentAId != 0){
        uint _registerLength = _auctions[parentAId].overAllRegisters.length;
        bool isExist =false;
        for(uint i=0;i<_registerLength;i++){
            address user = _auctions[parentAId].overAllRegisters[i];
            if(user==msg.sender){
                isExist = true;
                break;
            }
        }
        if(!isExist){
            _auctions[parentAId].overAllRegisters.push(msg.sender);
        }
        preRegisterList[parentAId][msg.sender].chances = 0;
    }
    else{
        _auctions[_aID].overAllRegisters.push(msg.sender);
    }
    uint256 _value = _auctions[_aID].bidBounds[0];
    
    _register(_aID, msg.sender, _value);
    transfer(owner, _value);
    
    return true;
  }
  
  function _register(uint256 _aID, address _user, uint256 _value) internal returns(bool){
    
    _auctions[_aID].bidBounds[3] = _auctions[_aID].bidBounds[3].add(1);
    _auctions[_aID].preRegisters.push(_user);
    preRegisterList[_aID][_user].status = 1;
    preRegisterList[_aID][_user].time = now;
    _auctions[_aID].bidBounds[2] = _auctions[_aID].bidBounds[2].add(_value);
    return true;
    
  }
  
  function isPreRegistered(uint256 _aID, address _address) public view returns(uint)
  {
    require(_aID > 0, "Auction ID should be > 0");
    require(_address != 0x0, "Provide valid address");
    
    return preRegisterList[_aID][_address].status;
  }
  function registeredListForAuction(uint256 _aID) public view returns(address[]){
    return _auctions[_aID].preRegisters;
  }
  
  function bidding(uint256 _aID) public payable returns(bool){
    
    uint256 _amount = _auctions[_aID].lastBidDetails[0].add(_auctions[_aID].bidIncrement);
    
    return manualBidding(_aID, _amount);
  }
  function manualBidding(uint256 _aID,uint256 _amount) public payable returns(bool){
      
    require(_aID > 0, "Auction ID should be > 0");
    require(preRegisterList[_aID][msg.sender].status == 1, "Not registred");
    require(_amount > 0, "Amount should be > 0");
    require(_auctions[_aID].lastBidDetails[0] < _amount,"Bid amount should be > last bid amount");
    require(_auctions[_aID].status == 0,"Auction ended");
    require(_amount.div(_auctions[_aID].bidIncrement).mul(_auctions[_aID].bidIncrement) == _amount,"Increment not correct");
    require(_auctions[_aID].times[0] <= now, "Not started");
    require(_auctions[_aID].times[1] >= now, "Auction ended");
    require(_amount <= _auctions[_aID].basePrice, "Amount should be < baseprice");
    require(_amount >= _auctions[_aID].bidBounds[0], "Amount should be > minbid");
    require(_auctions[_aID].bidBounds[1] <= _auctions[_aID].bidBounds[3], "Not much participants");
    require(balances[msg.sender].add(_auctions[_aID].bidBounds[0]) >= _amount,"No balance");
    
    if(preRegisterList[_aID][msg.sender].bidded == true){
      transfer(owner, _amount); 
    }
    else{
        uint256 parentAId = _cloneParent[_aID];
        if(parentAId != 0){
            preRegisterList[parentAId][msg.sender].chances = 3;    
        }
        preRegisterList[_aID][msg.sender].chances = 3;    
        preRegisterList[_aID][msg.sender].bidded = true;
        if(_auctions[_aID].bidBounds[0] < _amount){
            uint balance_amount =_amount.sub(_auctions[_aID].bidBounds[0]); 
            transfer(owner, balance_amount);
        }
        _bids[_aID][msg.sender].auctionID = _aID;
    }
    
    _bids[_aID][msg.sender].amount = _amount;
    _auctions[_aID].lastBidDetails[0] = _amount;
    _auctions[_aID].lastBidDetails[1] = now;
    _auctions[_aID].lastBidder = msg.sender;
    _auctions[_aID].times[1] = _auctions[_aID].times[1].add(_auctions[_aID].resetTime);
    
    emit Bidding(msg.sender, _aID, _amount, _auctions[_aID].times[1]);
    
    return true;
  }
  function finalizeAuction(uint256 _aID) public payable onlyOwner returns(bool){
    require(_auctions[_aID].status == 0,"Auction ended");
    _auctions[_aID].status = 1;
    uint256 parentAId = _cloneParent[_aID];
    if(parentAId != 0){
        _canClone[parentAId]=true;
    }
    if(_auctions[_aID].bidBounds[1] > _auctions[_aID].bidBounds[3]){
        uint _minBid = _auctions[_aID].bidBounds[1];
        for(uint j=0;j<_auctions[_aID].preRegisters.length;j++){
            address a = _auctions[_aID].preRegisters[j];
            if(parentAId != 0){
                if(preRegisterList[parentAId][a].chances == 0){
                    preRegisterList[parentAId][a].chances=3;
                    mint(a,_minBid);
                }
                else{
                    preRegisterList[parentAId][a].chances = preRegisterList[parentAId][a].chances.sub(1);    
                }
            }
            else{
                preRegisterList[_aID][a].chances=3;
                mint(a,_minBid);
            }
        }
    }
    
    emit AuctionFinalized(_aID,_auctions[_aID].lastBidder,_auctions[_aID].lastBidDetails[0]);
    return true;
  }
  
}