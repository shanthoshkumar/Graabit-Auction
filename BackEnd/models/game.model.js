var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var game = new Schema({
auctionid:{
  type:Number,required:true,
  unique: true
},
productname:{
  type:String,required:true
},
ipfshash:{
  type:String,required:true
},
Auctionstatus: {
  type: Boolean,
  default: false
},
description:{
  type:String,
  required:true
},
saltSecret: String
});

mongoose.model('Game',game)