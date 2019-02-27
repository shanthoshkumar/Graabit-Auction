const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const User = mongoose.model('User');
const Game = mongoose.model('Game');

// console.log(Object.keys(path))


// var upload = multer({ dest: 'uploads/' })
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })
// const upload = multer({
//     storage: storage
// })


var Web3=require('web3')
const _web3 = new Web3(new Web3.providers.HttpProvider('http://18.224.59.176:8545/'));
const abi=[
    {
        "constant": false,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            }
        ],
        "name": "bidding",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "oldAID",
                "type": "uint256"
            },
            {
                "name": "_startTime",
                "type": "uint256"
            },
            {
                "name": "_endTime",
                "type": "uint256"
            },
            {
                "name": "_regStartTime",
                "type": "uint256"
            },
            {
                "name": "_regEndTime",
                "type": "uint256"
            }
        ],
        "name": "cloneAuction",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_startTime",
                "type": "uint256"
            },
            {
                "name": "_endTime",
                "type": "uint256"
            },
            {
                "name": "_basePrice",
                "type": "uint256"
            },
            {
                "name": "_bidIncrement",
                "type": "uint256"
            },
            {
                "name": "_minBid",
                "type": "uint256"
            },
            {
                "name": "_resetTime",
                "type": "uint256"
            },
            {
                "name": "_regStartTime",
                "type": "uint256"
            },
            {
                "name": "_regEndTime",
                "type": "uint256"
            },
            {
                "name": "minBidders",
                "type": "uint256"
            }
        ],
        "name": "createAuction",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            }
        ],
        "name": "finalizeAuction",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            },
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "manualBidding",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_tokens",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            }
        ],
        "name": "PreRegister",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "auctionID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "winner",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "AuctionFinalized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "auctionID",
                "type": "uint256"
            }
        ],
        "name": "AuctionCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "bidder",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "auctionID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "auctionEndTime",
                "type": "uint256"
            }
        ],
        "name": "Bidding",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Mint",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            }
        ],
        "name": "auctionDetails",
        "outputs": [
            {
                "name": "times",
                "type": "uint256[]"
            },
            {
                "name": "basePrice",
                "type": "uint256"
            },
            {
                "name": "bidIncrement",
                "type": "uint256"
            },
            {
                "name": "bidBounds",
                "type": "uint256[]"
            },
            {
                "name": "resetTime",
                "type": "uint256"
            },
            {
                "name": "lastBidDetails",
                "type": "uint256[]"
            },
            {
                "name": "status",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "auctionList",
        "outputs": [
            {
                "name": "",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "accountbalance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            }
        ],
        "name": "bidDetails",
        "outputs": [
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_aId",
                "type": "uint256"
            }
        ],
        "name": "canClone",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "currentTime",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            },
            {
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "isPreRegistered",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "preRegisterList",
        "outputs": [
            {
                "name": "status",
                "type": "uint256"
            },
            {
                "name": "time",
                "type": "uint256"
            },
            {
                "name": "bidded",
                "type": "bool"
            },
            {
                "name": "chances",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_aID",
                "type": "uint256"
            }
        ],
        "name": "registeredListForAuction",
        "outputs": [
            {
                "name": "",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "tokensMinted",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
const _grabItContractAddress="0x855d83f0cd755d71503b112c7f64608c8fcb6256"
//local:"0x541055dc3749b4376c5bc35f43c6768c7aaa56f7",aws:"0x855d83f0cd755d71503b112c7f64608c8fcb6256"

const  grabit = new _web3.eth.Contract(abi,_grabItContractAddress,{gas: 2000000,  gasPrice: 0});
let livearray=[];
let upcomingarray=[];
let closedarray=[];

module.exports.filterclosed  = (req,res,next) =>{

    closedarray=[];          
    return new Promise(function(resolve, reject) {
        initialize().then(bunch=>{
           let closedlength=0; 
                 bunch.forEach(element => {
                    update(element).then(data=>{
                        gettime().then(now=>{
                            if((Number(data['times'][1]) < Number(now))) 
                            {
                                getDetails(data,element).then(obj=>{
                                        closedarray.push(obj)  
                                        closedlength++; 
                                    if(closedlength == bunch.length){
                                      //  console.log('Total Deals    '+bunch.length+'    Closed Deals    '+closedarray.length)
                                        res.send(closedarray);
                                    }   
                               })
                            }
                            else{
                                closedlength++;
                                if(closedlength == bunch.length){
                                    //console.log('Total Deals    '+bunch.length+'    Closed Deals    '+closedarray.length)
                                    res.send(closedarray);
                                } 
                            }
                        })
                    })
               
            }); 
            if(bunch.length == 0)   {
                res.send(closedarray);
            }     
        })
}).catch(e=>{
    console.log('ERROR'+e);
    
})}


module.exports.filterupcoming  = (req,res,next) =>{
    upcomingarray=[];          
    return new Promise(function(resolve, reject) {
        initialize().then(bunch=>{
           let  upcominglength=0; 
                 bunch.forEach(element => {
                    update(element).then(data=>{
                        gettime().then(now=>{
                            if((Number(data['times'][0]) > Number(now))) //Closed
                            {
                                    getDetails(data,element).then(obj=>{
                                        upcomingarray.push(obj)  
                                        upcominglength++; 
                                    if(upcominglength == bunch.length){
                                        //console.log('Total Deals    '+bunch.length+'    Upcoming Deals    '+upcomingarray.length)
                                        res.send(upcomingarray);
                                    }  
                                }) 
                            }
                            else{
                                upcominglength++;
                                if(upcominglength == bunch.length){
                                    //console.log('Total Deals    '+bunch.length+'    Upcoming Deals    '+upcomingarray.length)
                                    res.send(upcomingarray);
                                } 
                            }
                        })
                    })
               
            }); 
            if(bunch.length == 0)   {
                res.send(upcomingarray);
            }   
        })
}).catch(e=>{
    console.log('ERROR'+e);
    
})
}


module.exports.filterlive  = (req,res,next) =>{
    livearray=[];
    return new Promise(function(resolve, reject) {
        initialize().then(bunch=>{
        let  livelength=0;                  
                bunch.forEach(element => {
                    update(element).then(data=>{
                        gettime().then(now=>{
                            if((Number(data['times'][0]) < Number(now)) && (Number(data['times'][1])> Number(now))) //Live
                            {                               
                                    getDetails(data,element).then(obj=>{
                                        livearray.push(obj)    
                                        livelength++;  
                                
                                    if(livelength == bunch.length){
                                        // console.log('Total Deals    '+bunch.length+'    Live Deals     '+livearray.length)
                                        res.send(livearray);
                                    }   
                                 })
                            }
                            else{
                                livelength++;
                                if(livelength == bunch.length){
                                    // console.log('Total Deals    '+bunch.length+'    Live Deals    '+livearray.length)
                                    res.send(livearray);
                                } 

                            }
                        })
                    }) 
            }); 
            if(bunch.length == 0)   {
                res.send(livearray);
            }
        })
}).catch(e=>{
    console.log('ERROR'+e);
    
})
}

    function initialize() {
        // Return new promise 
        return new Promise(function(resolve, reject) {
            // Do async job
            grabit.methods.auctionList().call().then((result) =>{
             if(result){
                 resolve(result);
             }
             else{
                 console.log('Error')
             }
            }).catch(e=>{
                console.log(e);
            });
        })
    
    }



    function update(auc_id) {
        // Return new promise 
        return new Promise(function(resolve, reject) {
            // Do async job
            grabit.methods.auctionDetails(auc_id).call().then((result) =>{ 
                if (result) {
                    result.auc_id=auc_id;
                    resolve(result);
                }
                else{
                    console.log('Error');
                }
            })
        }).catch(e=>{
            console.log('ERROR'+e)
        });
    }



    function gettime() {
        // Return new promise 
        return new Promise(function(resolve, reject) {
            // Do async job
            let _currentTime = (Date.now()/1000);
            // console.log(_currentTime,'_currentTime')
            resolve(_currentTime.toString().split('.')[0]);
        });
    }



    function getDetails(data,auc_id) {
        // Return new promise 
        return new Promise(function(resolve, reject) {
            // Do async job
            Game.findOne({"auctionid":auc_id},function(err,productDetail){
                if(!err){
                    // imagePromiser(productDetail.ipfshash).then(imagestring => {
                        data['productname']=productDetail.productname;
                        data['description']=productDetail.description;
                        data['ipfshash'] = productDetail.ipfshash
                        // imagestring;
                    // });
                    resolve(data);       
                }
            })
        })
    }

    // function imagePromiser(productImageName) {
    //     // Return new promise 
    //     return new Promise(function(resolve, reject) {
    //         // let productImageName = ipfshash;
    //         fs.readFile(__basedir+'/uploads/'+productImageName,(err,imgdata)=>{
    //             var buf = Buffer.from(imgdata);
    //             var base64 = buf.toString('base64');
    //             let imageextension = path.extname(productImageName).substring(1);
    //             // console.log(imageextension);
    //             let imagestring = "data:image/"+imageextension+";base64,"+base64;
    //             resolve(imagestring)
    //         });
    //     })
    // }
    
module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.publickey = req.body.publickey;
    user.privatekey = req.body.privatekey;
    user.save((err, doc) => {
        if (!err)
        {
            res.json("signed up succesfully");
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate Credentials Occured.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {    
    passport.authenticate('local', (err, user, info) => {  
        // console.log(user);       
        if (err) { return res.status(400).json(err); }
        else if (user.email != req.body.email && user.password != req.body.password){
        return res.status(404).json({ status: false, message: 'Invalid Credentials.'  });
        }
        else if (user){ return res.status(200).json({ "token": user.generateJwt(),"privatekey":user.privatekey });}
        else{ return res.status(404).json(info);}
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id},
        (err, user) => {
            if (!user){
                return res.status(404).json({ status: false, message: 'User record not found.' });
            }
            else{
                return res.status(200).json({user : _.pick(user,['fullName','email','publickey']) });
            }
        }
    );
}

module.exports.changepassword = (req, res, next) =>{     
User.findOne({"email":req.body.email},function(err,user){
    if (err){
        return res.status(404).json({ status: false, message: 'User record not found.' });               
    }
    else{
        if(!user.verifyPassword(req.body.passwordold)){             
            
                return res.status(404).json({ status: false, message: 'User password is wrong.' });     
            }
            else{
                var _user = new User();                
                User.findOneAndUpdate({'email':user.email},{$set:{"password":_user.encryptPassword(req.body.password)}},function(errr,userr){
                    if(!userr){
                        return res.status(404).json({ status: false, message: 'User record not found.' }); 
                    }                   
                    else if(userr) {                        
                        return res.status(200).json(user);
                    }   
                })
            }
         }
      })
   }

module.exports.forgotpassword = (req, res, next) =>{
    var _user = new User();
    User.findOne({'email':req.body.email},function(err,user){
        if(!user){
            return res.status(404).json({ status: false, message: 'User record not found.' }); 
        }
        else if(user.publickey != req.body.publickey){
            return res.status(404).json({ status: false, message: 'User private key miss match.' }); 
        }          
        else {
            User.findOneAndUpdate({'email':user.email},{$set:{"password":_user.encryptPassword(req.body.password)}},function(errr,userr){
                if(!userr){
                    return res.status(404).json({ status: false, message: 'User record not found.' }); 
                }                  
                else {
                    // console.log("success");                    
                    return res.status(200).json(user);
                }   
            })
        }
    })
 }

    module.exports.getAuctionById=(req,res,next)=>{
        Game.findOne({"auctionid":req.params.auctionid},function(err,productDetail){
            if(!err){
                return res.json(productDetail);
                // let productImageName = productDetail['ipfshash']
                // fs.readFile(__basedir+'/uploads/'+productImageName,(err,imgdata)=>{
                //     var buf = Buffer.from(imgdata);
                //     var base64 = buf.toString('base64');
                //     let imageextension = path.extname(productImageName).substring(1);
                //     // console.log(imageextension);
                //     let imagestring = "data:image/"+imageextension+";base64,"+base64;
                //     productDetail['ipfshash'] = imagestring;
                //     return res.json(productDetail);
                // })
            }
            else{
                return res.status(404).json({status:false,message:'Auction Not Found'});
            }
        })
    }


    module.exports.productdetailssave = ( req, res, next )=>{
        var Auction = new Game();
        Game.find(function(errr,games){  
            Auction.auctionid = games.length+1;
            Auction.productname = req.body.product_name;
            Auction.ipfshash =req.body.ipfs_hash;
            Auction.description = req.body.description;
            Auction.save(function(err,user){
                if (!err){
                    // console.log("user");
                    // console.log(user);
                    res.json(games.length+1);
                }
                else {
                    if (err.code == 11000)
                        res.status(422).send(["Error Occured"]);
                    else
                        return next(err);
                }
            })
        })
    }


    module.exports.productDetails = (req, res, next) =>{
        Game.find(function(err,productsDetails){
            if(err){
                return res.status(400).json(err);
            }    
            else {
                return res.json(productsDetails);
                // let index = 0;
                // if(productsDetails.length != 0){
                //     productsDetails.forEach(productDetail => {
                //         let productImageName = productDetail['ipfshash']
                //         fs.readFile(__basedir+'/uploads/'+productImageName,(err,imgdata)=>{
                //             var buf = Buffer.from(imgdata);
                //             var base64 = buf.toString('base64');
                //             let imageextension = path.extname(productImageName).substring(1);
                //             console.log(imageextension);
                //             let imagestring = "data:image/"+imageextension+";base64,"+base64;
                //             productsDetails[index]['ipfshash'] = imagestring;
                //             index++;
                //             if(parseInt(productsDetails.length) == index){
                //                 return res.json(productsDetails);
                //             }
                //         })
                //     })
                // }
                // else{
                //     return res.json(productsDetails);
                // }
            }
        })
    }
 
    
    module.exports.getUserName=(req,res,next)=>{
        User.findOne({'publickey':req.params.publickey},function(err,userDetail){
            if(err){
                return res.status(400).json(err);
            }
            else {
                return res.status(200).json(userDetail);
            }
         })
        }
 
    module.exports.userDetails = (req, res, next) =>{
        User.findOne({"email":emailid},function(err,userDetail){
            return res.json(userDetail);
        })    
    }

    module.exports.getTime = (req, res, next) =>{
        let _currentTime = (Date.now()/1000);
        // console.log(_currentTime,'_currentTime')
        return res.json(_currentTime.toString().split('.')[0]);
    }
    
    // module.exports.getProductImage = (req, res, next) =>{
        
    //     fs.readFile(__basedir+'/uploads/'+req.params.productImageName,(err,imgdata)=>{
    //         var buf = Buffer.from(imgdata);
    //         var base64 = buf.toString('base64');
    //         let imageextension = path.extname(req.params.productImageName).substring(1);
    //         console.log(imageextension);
    //         let imagestring = "data:image/"+imageextension+";base64,"+base64;
    //         res.status(200).json({"imagestring":imagestring});
    //     })
    //     // res.status(200).sendFile(__basedir+'/uploads/'+req.params.productImageName);
        
    //     // );
    //     // Games.findOne({"auctionid":req.body.productImageName},function(errproductImageName
            
    //     //     // return res.json(productImages);
    //     // })
    //     // return res.json(_currentTime.toString().split('.')[0]);
    // }

    module.exports.showselectedproducts = (req, res, next) =>{
        var stat;
        Game.findOne({"auctionid":req.body.auctionid},function(er,res){
        if(res["Auctionstatus"]==true){
        Game.findOneAndUpdate({"auctionid":req.body.auctionid},{$set:{Auctionstatus:false}},function(err,userDetail){
        if(err){
            return res.status(400).json(err);
        }
      })
    }
    else{
    Game.findOneAndUpdate({"auctionid":req.body.auctionid},{$set:{Auctionstatus:true}},function(err,userDetail){
        if(err){
            return res.status(400).json(err);
        }
       })
    }
        })
        return res.status(200).json("successfully updated");
    }
    module.exports.fileuploader = (req,res,next)=>{
        // res.send('File uploaded successfully! -> filename = ' + req.file.filename);
        // path.//
        let oldpath = __basedir+'/uploads/'+req.file.filename;
        // console.log("oldpath",oldpath);
            
            // console.log("new_path_file",new_path_file);
            Game.find(function(errr,games){  
                let auctionid = games.length+1;
                let _newfilename = 'A'+auctionid +'-' + Date.now() + path.extname(req.file.filename);
                let new_path_file = __basedir+'/uploads/'+ _newfilename;
                fs.rename(oldpath,new_path_file,(error,response)=>{
                    if(error){
                        res.status(400).json(error);
                    }
                    else{
                        res.status(200).json({"newimagename":_newfilename});
                    }
                    
                });
            });

        // fs.rename(__basedir+'/uploads/'+req.file.filename,__basedir+'/uploads/'+'A'+ '-' + Date.now() + path.extname(req.file.filename),(error,response)=>{
        //     res.status(200).json({"isuploaded":"success"});
        // });
        // fs.readFile(req.files[0].path, function (err, data) {
        //     console.log('Stored');
        //     fs.writeFile('./uploads/' + "filename.png", data, 'utf8', function(err) {})
        //     // _ipfs.files.add(data,function(error,files){
        //     //     if(!error){
        //     //         fs.unlinkSync(__dirname+'../../uploads/'+req.files[0].filename);
        //     //         console.log('Cleared...'); 
        //     //         res.json(files[0].hash);        
        //     //     }
        //     //     else{
        //     //         console.log(error) 
        //     //     }
        //     // })
        // })
    }
// module.exports.fileuploader = (req,res,next)=>{
//     // app.post('/api/file', function(req, res) {
//         // var upload = multer({
//         //     storage: multer.memoryStorage()
//         // },{ dest: 'uploads/' }).single('userFile')
//         upload(req, res, function(err) {
//             // console.log(req.body)
//             var buffer = req.body.imagebuffer;
//             // console.log(buffer);
//         //     // var magic = buffer.toString('hex', 0, 4)
//             var filename = req.body.fieldname + '-' + Date.now() + path.extname(req.body.originalname)+".png"
//             // console.log(filename);
//         //     // if (checkMagicNumbers(magic)) {
//         //         // fs.writeFile()
// //         var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0"
// //     + "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO"
// //     + "3gAAAABJRU5ErkJggg==";
// // // strip off the data: url prefix to get just the base64-encoded bytes
//         var data = buffer.replace(/^data:image\/\w+;base64,/, "");
//         var buf = new Buffer(data, 'base64');
// // fs.writeFile('image.png', buf);
//                 fs.writeFile('./uploads/'+filename, buf, 'utf8', function(err) {
//                     console.log(err)
//                 });
//         });
//         // console.log("req.body")
//                 // upload(req, res, function(err) {})
//         // console.log(req)
//         // upload(req.body.imagebuffer)
//         // console.log(req.file.path)
//         // upload(req, res, function(err) {
//         //     var buffer = req.body.imagebuffer;
//         //     // var magic = buffer.toString('hex', 0, 4)
//         //     var filename = req.body.fieldname + '-' + Date.now() + path.extname(req.body.originalname)
//         //     // if (checkMagicNumbers(magic)) {
//         //         // fs.writeFile()
//         //         fs.writeFile('./uploads/' + filename, buffer, 'utf8', function(err) {
//         //             if (err) throw err
//         //             res.end('File is uploaded')
//         //         })
//         //     // } else {
//         //     //     res.end('File is no valid')
//         //     // }
//         // })
//     // })
    
// };
