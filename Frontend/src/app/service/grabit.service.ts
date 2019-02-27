import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Tx from 'ethereumjs-tx';
import { Buffer } from "buffer";
import { environment } from '../../environments/environment';
import { User } from '../shared/user.model';
import Web3 from "../web3.min.js";
import { Router } from '@angular/router';
import  jwtDecode from  'jwt-decode';

declare let require:any;
let json = require('./grabit.json');

@Injectable({
  providedIn: 'root'
})
export class GrabitService {

  public  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  public _privateKey:string;
  public _grabItContractAddress: string = "0x855d83f0cd755d71503b112c7f64608c8fcb6256";
  //local:"0x541055dc3749b4376c5bc35f43c6768c7aaa56f7",aws:"0x855d83f0cd755d71503b112c7f64608c8fcb6256"
  public _etherumAccountAddress;
  public _grabItContract: any;
  public _web3;
  public imgshow:boolean;
  public prod_zoom={};
  public isadmin:boolean=false;
  public upcomingDivTarget:boolean = false;
  public regnotifyshower:number = 0;
  public isLoggedIncheck:boolean = false;
  public isbidsuccess:boolean = false;
  // public currenTimeStamp:number;
  // public currenttimeinterval;
  public lastliveauctionid:number;
  public lastupcomingauctionid:number;
  public closedauctionid:number;
  public triggerlive:boolean = false;
  public triggerupcoming:boolean = false;
  public triggerclosed:boolean = false;
  public myExpDealLength:number = 0;

  //for registeration tracking
  public regPenAucId = [];
  public regPenHash:any[] = []; //no value found -> undefined,before hash -> '-',rejected -> 'error'

  //for token exp tracking
  public accountInterval:any;

  constructor(private http:HttpClient,private route:Router) {
    let meta = this;
    meta._web3 = new Web3(new Web3.providers.HttpProvider('http://18.224.59.176:8545/'));
    meta._grabItContract = new this._web3.eth.Contract(json,this._grabItContractAddress,{gaslimit:3000000});
    if(localStorage.getItem('Session_privateKey')){
      meta.check_admin();
      meta.isLoggedIncheck = true;
      meta.setPrivateKey(localStorage.getItem('Session_privateKey'));
      meta.isTokenExpired();
    }
    // console.log(meta.getToken().exp);
    // console.log(this.regPenHash[150])
    // meta._web3.eth.getTransactionReceipt('0xaa80fd8e6499a50828b2890c6c9bb5cf302475f2ba7cfa50c9f50aa17a63f15a',function(err,res){
    //   console.log(res)
    // });
    // this.mint( "0xf98efdc19c2a64ef6a3ae8ca310d7cbd367baaa8",9);
    // meta.getauctiondetails().then(console.log)
    // meta.getProductImage("A3-1548995187205.png")
    // meta.getauctiondetails().then(console.log)
    
  }

  //jwt token expiration
  isTokenExpired(){
    let meta = this;
    let token=meta.getToken();
    clearInterval(meta.accountInterval);
    meta.accountInterval = setInterval(function(){  
        if(token !== null){
          var decoded = jwtDecode(token);
          if( Date.now() > decoded.exp*1000){
            meta.signout();
            meta.clear_pending_details();
            meta.route.navigate(['/signingout'])
            clearInterval(meta.accountInterval);
            alert('Session expired! Please Log-in again..')
          }
        }  
        else{
          meta.signout();
          meta.clear_pending_details();
          meta.route.navigate(['/signingout'])
          clearInterval(meta.accountInterval);
        }
    },1000)
  }

  signout(){
    let instance = this;
    instance.deleteToken();
    instance.deleteSessionPrivateKey();
    instance._privateKey='';
    instance._etherumAccountAddress='';
    instance.isLoggedIncheck = false;
    instance.isadmin = false;
  }

  clear_pending_details(){
    let meta = this;
    let index = 0;
    meta.regPenAucId.forEach(auction_id => {
      index++;
      meta.regPenHash[auction_id] = undefined;
      if(index == meta.regPenAucId.length){
        meta.regPenAucId = [];
      }
    })
  }
// let meta=this;
//  meta.token_expiry=setInterval(()=>{
//    if(meta.grab.getToken()!=null){
//      meta.check_token_expiry().then(status=>{
//        if(status){
//          console.log('Token has expired');
//          meta.route.navigate(['/home']);
//          meta.signout();
//          clearInterval(meta.token_expiry)
//        }
//      })
//  }
//  },100)





  getProductImage(productImageName){
    let meta = this;
    // console.log("A3-1548995187205.png");
    return meta.http.get(environment.api+'/getProductImage/'+productImageName);
    // .subscribe(res => {
    //   // console.log(res['imagestring'])
    //     return res['imagestring'];
    //     // "data:image/"+res['imageextension']+";base64,"+res['imagebuffer'];
    //   },
    //   err => {
    //     // meta.productimage = err['error']['text'];
    //     console.log("errimg",err)
    //   }
    // )
    
  }
  refresh(){
    window.onload = function () {  
      document.onkeydown = function (e) {  
          return (e.which || e.keyCode) != 116;  
      };  
  }  
  }

  public async all_closed_auctions():Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(environment.api+'/filterClosed').subscribe(res=>{
        resolve(res);
      },err=>{
        resolve(err);
      }) 
    }) as Promise<any>;
    }
  
  public async all_upcoming_auctions():Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(environment.api+'/filterUpcoming').subscribe(res=>{
        resolve(res);
      },err=>{
        resolve(err);
      })
    }) as Promise<any>;
    }
  
    
  public async all_live_auctions():Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(environment.api+'/filterLive').subscribe(res=>{
        resolve(res);
      },err=>{
        resolve(err);
      })
    }) as Promise<any>;
    }


  check_admin(){
    let meta = this;
    meta.owner().then(owner => {
      if(meta._etherumAccountAddress==owner){
        meta.isadmin=true;
      }
    })
  }

  getUserName(public_key) { //new
    return this.http.get(environment.api + '/getUserName/'+public_key,this.noAuthHeader);
  }
 
  getAuctionById(id) { //new
    // var obj={};
    // obj["auctionid"]=id;
    return this.http.get(environment.api +'/getAuctionById/'+id,this.noAuthHeader);
  }
 
   getuserthings(){
    var token = this.getToken();
    // var to={};
    // to['token']=token;
    // console.log("token",token);
    
    return this.http.get(environment.api + '/userProfile/'+token,this.noAuthHeader);
  } 
   storeselectedproduct(selected) {
    return this.http.put(environment.api +'/storeselectedproduct',selected);
  }

public async specific_bid_details(_aID):Promise<any>{
return new Promise((resolve,reject)=>{
    this._grabItContract.getPastEvents('Bidding',{fromBlock:0, toBlock: 'latest'}, function(error, result){
      if(!error){
         let array=[];
         result.find(function(element) {
          if(element['returnValues'].auctionID == _aID)
          {
            array.push(element)
          }
        });
        resolve(array)
        }
      else{
      }
    })
}) as Promise<any>;
}


public async lastBidderDetails(_aID):Promise<any>{
  return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('Bidding',{fromBlock:0, toBlock: 'latest'}, function(error, result){ 
        if(!error){
           let array=[];
           result.find(function(element) {
            if(element['returnValues'].auctionID == _aID)
            {
              array.push(element)
            }
          });

          if(array.length!=0)
          {
            resolve(array[array.length-1]);
          }
        else{
          resolve('No Bid Logs Found')
        }
        }
        else{
        }
      })
  }) as Promise<any>;
 }

//  imageupload(fr_result,fieldname,originalname){
//   let meta = this;
//   let obj = {};
//   obj["imagebuffer"]= fr_result;
//   // obj["fieldname"]= fieldname;
//   // obj["originalname"]= originalname;
//   meta.http.post(environment.api+'/fileuploader',fr_result,meta.noAuthHeader).subscribe(res => {
//     console.log(res)
//   },
//   err => {
//     console.log(err)
//   })
//  }

public async pushFileToStorage(file: File):Promise<any>{
  let meta = this;
  return new Promise((resolve,reject)=>{
      let meta = this;
     const formdata: FormData = new FormData();
   
     formdata.append('file', file);
     meta.http.post(environment.api+'/fileuploader',formdata,meta.noAuthHeader).subscribe(res => {
       resolve(res['newimagename'])
     })
  }) as Promise<any>
};

 
public async Particular_bid_details(_aID):Promise<any>{
  let meta = this;
  return new Promise((resolve,reject)=>{
    meta._grabItContract.getPastEvents('Bidding',{fromBlock:0, toBlock: 'latest'}, function(error, result){ 
      if(!error){
        // console.log("aucid",_aID);
        
        let totalBidAmount = 0;
        result.forEach(element => {
          if(element.returnValues.auctionID == _aID && element.returnValues.bidder == meta._etherumAccountAddress){
            // console.log("aucid",_aID,element.returnValues.amount);
            totalBidAmount = Number(totalBidAmount)+Number(element.returnValues.amount);
          }
        });
        // result.find(function(element) {
        //   if(element['returnValues'].auctionID == _aID)
        //   {
        //     let i=0;
        //     while(i<result.length){
        //       if(element['returnValues'].bidder == meta._etherumAccountAddress){
        //         // console.log(element['returnValues'].amount,"aid",_aID)
        //         totalBidAmount = Number(totalBidAmount)+Number(element['returnValues'].amount);
        //         // console.log(totalBidAmount);
        //       }
        //       i++;
        //     }
        //   }
        // });
        resolve(totalBidAmount);
      }
      else{
      }
    })
  }) as Promise<any>;
 }

public async event_Bidding():Promise<any>{
  return new Promise((resolve,reject)=>{
    this._grabItContract.getPastEvents('Bidding',{fromBlock:0, toBlock: 'latest'},function(error,result){
      // console.log(result);      
      resolve(result);
    })  
  }) as Promise<any>;
}
   public async event_OwnershipTransferred():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('OwnershipTransferred',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_Mint():Promise<any>{
     let meta = this;
    return new Promise((resolve,reject)=>{
      meta._grabItContract.getPastEvents('Mint',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_Transfer():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('Transfer',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_AuctionFinalized():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('AuctionFinalized',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_AuctionCreated():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('AuctionCreated',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

  postUser(user:User){
    return this.http.post(environment.api+'/register',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.api + '/authenticate', authCredentials,this.noAuthHeader);
  }

  // forgotpassword(temp1) {
  //   return this.http.put(environment.api + '/forgotpassword',temp1,this.noAuthHeader);
  // }
  forgotpassword(temp1) {
    return this.http.put(environment.api + '/forgotpassword',temp1,this.noAuthHeader);
  }
 
  public async preregister(auctionid):Promise<number>{
    let instance = this;
    // if(canRoute){
    instance.regPenAucId.push(auctionid);
    instance.regPenHash[auctionid] = '-';
    instance.route.navigate(['/mydeals']);
    
    // }
    console.log("after route",Date.now())
    return new Promise((resolve,reject)=>{
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.PreRegister(auctionid);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        console.log("before sendsign",Date.now())
        // return;
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            instance.regPenHash[auctionid] = 'error';
            console.log("err")
            resolve(0)
          }
          else{
            instance.regPenHash[auctionid] = result;
            // instance.hash(result).then(res =>{
            //   //for tracking registeration
            //   if(res == 0){
            //     resolve(0)
            //   }
            //   else if(res == 1) {
            //     resolve(1)
            //   }
            //   else if(res == 2) {
            //     resolve(2)
            //   }
            // })
          }
        })
      })
    })as Promise<number>;
  }
    public async ispreregistered(auctionid):Promise<number>{
      var instance = this;
      return new Promise((resolve,reject)=>{
        instance._grabItContract.methods.isPreRegistered(auctionid,this._etherumAccountAddress).call(function(error, result){
          if(error != null) {
            reject(error);
          }
          else {
            resolve(result)
          }
        });
      })as Promise<number>
    }

    
  public async getauctiondetails(): Promise<any> {   
    return new Promise((resolve, reject) => {
      {
        // console.log("getauctiondetails called");
     this.http.get(environment.api + '/productDetails').subscribe(res=>{
      //  console.log("after")
      //  console.log(res)
       let temp:any=res;
       let array=[];
       for(let a=0;a<temp.length;a++)
       {
         array.push(a);
       }
          let result=[];
          result.push(array);
          result.push(res);
         resolve(result)
       
    },err=>{
      console.log(err);
      
    });
  }
}) as Promise<any>;
  }

  public async registeredListForAuction(auctionid):Promise<string[]>{
    var instance = this;
    return new Promise((resolve,reject)=>{
      instance._grabItContract.methods.registeredListForAuction(auctionid).call(function(error, result){
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    })as Promise<string[]>
  }
  
  public async canClone(auctionid):Promise<boolean>{
    var instance = this;
    return new Promise((resolve,reject)=>{
      instance._grabItContract.methods.canClone(auctionid).call(function(error, result){
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    })as Promise<boolean>
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.isTokenExpired();
  }

  setPrivateKeyInSession(privateKey:string){
    localStorage.setItem('Session_privateKey',privateKey);
  }

  getSessionPrivateKey(){
    return localStorage.getItem('Session_privateKey');
  }
  
  deleteSessionPrivateKey(){
    return localStorage.removeItem('Session_privateKey');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  public async getPrivateKey():Promise<any>{
    let meta = this;
    return new Promise((resolve,reject)=>{
      
      meta.owner().then(owneraddress => {
        let credential ={};
        credential['privateKey'] = localStorage.getItem('Session_privateKey');
        // console.log("credential['privateKey']",credential['privateKey'])
        credential['isowner'] = false;
        if(credential['privateKey'] != null){
          credential['isowner'] = (owneraddress == meta._web3.eth.accounts.privateKeyToAccount('0x'+credential['privateKey'])['address']);
        }
        resolve(credential);
        // console.log(credential)
      })
      
      
    }) as Promise<any>;
  }
  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }
  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
  public async  upload(ipfs_hash,product_name,description): Promise<boolean> {   
    return new Promise((resolve, reject) => {
    let obj={};
        obj['ipfs_hash']=ipfs_hash;
        obj['product_name']=product_name;
        obj['description']=description;
        console.log("obj to post",obj)
        this.http.post(environment.api+'/productdetailssave',obj,this.noAuthHeader)
        .subscribe(res=>{
          console.log(res)
          resolve(true);
        },err=>{
          console.log(err);
          resolve(false);
        })
  }) as Promise<boolean>;
}

  
  changepassword(change){
    return this.http.put(environment.api+'/changepassword',change,this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.api + '/userDetails',this.noAuthHeader);
  }

  public async setPrivateKey(privateKey): Promise<boolean> {   
    let instance = this;
    instance._privateKey=privateKey;
    instance.setPrivateKeyInSession(privateKey);
    return new Promise((resolve, reject) => {
      let obj;
        try{
          obj= instance._web3.eth.accounts.privateKeyToAccount('0x'+privateKey);    
        }
        catch(e)
        {
          resolve(false);
        }
        instance._etherumAccountAddress=obj["address"];
        instance.check_admin();
        resolve(true);
    }) as Promise<boolean>;
  }
  
  public async getEtherumAccountBalance(): Promise<number> {
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getBalance(instance._etherumAccountAddress,function(err,result){
        if(err != null) {
          reject(err);
        }
        else{
          resolve(instance._web3.utils.fromWei(result,'ether'));
        }
      })
    }) as Promise<number>;
  }

  public async owner(): Promise<string> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.owner().call(function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<string>;
  }

  public async transferOwnership(newOwner):Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.transferOwnership(newOwner);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value: '0x00',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async transfer( _to,_value):Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.transfer(_to,_value);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value: '0x00',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async mint( _to,_tokens):Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.mint(_to,_tokens);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value: '0x00',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        // instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex')).on('receipt', receipt => {
        //   console.log(receipt)
        // })
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async balanceOf(): Promise<number> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.balanceOf().call({from:instance._etherumAccountAddress},function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result);//instance._web3.utils.fromWei(result,'ether')
        }
      });
    }) as Promise<number>;
  }

  // currentTimeInitializer() {                                       
  //   let instance = this;
  //   instance.http.get(environment.api + '/getTime/',this.noAuthHeader).subscribe(res=>{
  //     console.log(res);
  //     instance.currenTimeStamp = Number(res);
  //     clearInterval(instance.currenttimeinterval);
  //     instance.currenttimeinterval =  setInterval(()=>{
  //       instance.currenTimeStamp = Number(instance.currenTimeStamp)+1;
  //     },1000);
  //   },
  //   err=>{
  //       console.log(err);
  //   });
  // }

  public async currentTime(): Promise<number> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance.http.get(environment.api + '/getTime/',this.noAuthHeader).subscribe(res=>{
          resolve(Number(res));
        });
      }
    ) as Promise<number>;
  }

  public async createAuction(start,end,base_price,bid_increment,minimum_bid,reset_time,reg_start,reg_end,minimum_bidders) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.createAuction(start,end,base_price,bid_increment,minimum_bid,reset_time,reg_start,reg_end,minimum_bidders);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            console.log('Hashing...');
            
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
                console.log('Deployed...');
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }


  public async cloneAuction(productid,starttime,endtime,rgstarttime,rgendtime) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.cloneAuction(productid,starttime,endtime,rgstarttime,rgendtime);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            console.log('Hashing...');
            
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
                console.log('Deployed...');
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async auctionDetails(_aID): Promise<any> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.auctionDetails(_aID).call(function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<any>;
  }

  
  public async bidDetails(_aID): Promise<any> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.bidDetails(_aID).call({from:instance._etherumAccountAddress},function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<any>;
  }

  public async auctionList(): Promise<number[]> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.auctionList().call(function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<number[]>;
  }

  public async manualBidding(_aID,_amount) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.manualBidding(_aID,_amount);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            console.log('Hashing...');
 
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
                console.log('Deployed...');
 
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }
  public async finalizeAuction(_aID) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.finalizeAuction(_aID);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async hash(a): Promise<number> {
    let meta = this;
    return new Promise((resolve, reject) => {
      var accountInterval = setInterval(function()
      {
        meta._web3.eth.getTransactionReceipt(a,function(err,result){
          // console.log(result)
          if(err != null) {
            resolve(0);
          }
          if(result !== null)
          {
            clearInterval(accountInterval);
            if(result.status == 0x1)
            {
              resolve(1);
            }
            else
            {           
              resolve(2);
            }
          }
        })
      },100)
    }) as Promise<number>;
  }
}

