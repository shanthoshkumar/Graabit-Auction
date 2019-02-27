import { Component, OnInit, Input, Output,ElementRef, EventEmitter } from '@angular/core';
import { GrabitService } from "../service/grabit.service";
import { AppComponent } from "../app.component";
import { MatTableDataSource } from "@angular/material/table";
import { MydealsComponent } from '../mydeals/mydeals.component';
declare let $:any;
@Component({
  selector: 'app-mydealsproduct',
  templateUrl: './mydealsproduct.component.html',
  styleUrls: ['./mydealsproduct.component.css']
})
export class MydealsproductComponent implements OnInit {

  @Input() start;
  @Input() end;
  @Input() MyActiveDeal;
  @Output() zeroTrigger;
  @Input() timeOnly;
  timer: any;
  checkBid: any;
  displayTime: any;
  auctionLive:boolean = false;
  auctionWait:boolean = false;
  auctionReg:boolean = true;
  auctionExpired:boolean = false;
  minimumBiddersNotMeet:boolean = false;
  auction_endTime:number ;

  product_name;
  ipfs;
  bidincrement:number;
  basePrice;
  registered;
  required;
  resettime;
  highestbidamount;
  Bidder_name;
  bid_amount;
  min_bid;
  bidder_message:boolean=false;
  bidder_message_content:string='';
  auction_id;
  btnShow:boolean = true;
  description;
  bidder_history = [];
  no_bidder_history:boolean = false;

  events=[];

  displayedColumns = ['sno','user','price' ];

//   dataSource;
bid_details_array=[];

  ELEMENT_DATA:UserData[]=[];
// 	  {
// 		sno: 111,
// 		user: 'kumar',
// 		price: '444'
// 	  }
//   ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  latestBidding:any;

  //for regPendHash 
  regPenHash; //'No Pending Hash',,before hash -> ,rejected -> 'error'
  isRegPending:boolean = false;
  beforehashtimer;
  isRegTimeOver:boolean = false;
  isTxProgressing:boolean = false;
  constructor(
    private el: ElementRef,
    private grab:GrabitService,
	// private app:AppComponent,
	private deal:MydealsComponent

  ) {
    this.zeroTrigger = new EventEmitter(true);
     const data: UserData[] = [];

  }

  ngOnInit():void {
	  let meta=this;
	meta.auction_id = meta.MyActiveDeal['auction_id']
	meta.product_name = meta.MyActiveDeal['product_name']
	meta.min_bid = meta.MyActiveDeal['min_bid']
	meta.ipfs = meta.MyActiveDeal['ipfs']
	meta.bidincrement = meta.MyActiveDeal['bidincrement']
	meta.basePrice = meta.MyActiveDeal['base_price']
	meta.registered = meta.MyActiveDeal['reg_bidders']
	meta.required = meta.MyActiveDeal['req_bidders']
	meta.resettime = meta.MyActiveDeal['resettime']
	meta.auction_endTime = meta.MyActiveDeal['auction_end']
	meta.auction_id = meta.MyActiveDeal['auction_id']
	meta.description = meta.MyActiveDeal['description']
	meta.regPenHash = meta.MyActiveDeal['regPenHash']
	console.log("auctionid",meta.auction_id,meta.regPenHash)
	// meta.isRegTimeEnd();
	// meta.isRegPending = true;
	meta.last_bidder_trigger();
	meta.auction_conditions();
	
	if(meta.regPenHash != 'No Pending Hash') {
		meta.trackhash();
	}
  }

  trackhash(){
	let meta = this;
	meta.isRegPending = true;
	if(meta.regPenHash == 'error'){
		meta.handleError();
	}
	else if(meta.regPenHash ==  '-'){ //before hash
		meta.beforehashtimer = setInterval(()=>{
			if(meta.grab.regPenHash[meta.auction_id] !=  '-'){
				meta.regPenHash = meta.grab.regPenHash[meta.auction_id];
				clearInterval(meta.beforehashtimer);
				meta.trackhash();
			}
		},800); 
	}
	else{ //isTransaction processed
		meta.isRegPending = true;
		meta.grab.hash(meta.regPenHash).then(isTxSuccess => {
			
			if(isTxSuccess == 1){
				meta.isRegPending = false;
				meta.regPenHash = 'No Pending Hash';
				meta.grab.regPenHash[meta.auction_id] = undefined;
			}
			else{ //failed again call preRegisteration
				meta.isRegPending = true;
				meta.regPenHash = 'error';
				meta.trackhash();
			    // meta.notification_content = 'Transaction Failed!';
			}
		})
	} 
  }

  public async isRegTimeEnd():Promise<Boolean>{
	let meta = this;
	return new Promise((resolve,reject)=>{
		meta.grab.currentTime().then(now_time => {
			meta.grab.auctionDetails(meta.auction_id).then(auction_Details => {
				if(Number(auction_Details['times'][3])<Number(now_time)){
					//registeration over
					meta.isRegTimeOver = true;
					resolve(true);
				}
				else{
					meta.isRegTimeOver = false;
					resolve(false);
				}
			})
		});
	}) as Promise<Boolean>;

  }

  handleError(){
	//handle error and if: send().preRegisteration and call trackhash();
	let meta = this;
	meta.isRegTimeEnd().then(_isRegTimeOver => {
		if(_isRegTimeOver){
			//show time over message
			meta.bidder_message = true;
			meta.bidder_message_content = 'Registeration Time Over';
			meta.btnShow = false;
		}
		else{
			//after checking bid packs ether balance
			meta.grab.balanceOf().then(grabitBalance => {
				if (Number(grabitBalance) >= Number(meta.bid_amount)) {
					meta.grab.preregister(meta.auction_id)
					meta.regPenHash = '-';
					meta.trackhash();
				}
				else{
					meta.bidder_message = true;
					meta.bidder_message_content = "Can't Register: Grraabit Balance Is Low!"
					meta.btnShow = false;
				}
			})
		}
	});
  }

  last_bidder_trigger(){
	let meta = this;
	meta.grab.lastBidderDetails(meta.MyActiveDeal['auction_id']).then(latestDetails => {
		if (latestDetails == 'No Bid Logs Found') {
			meta.highestbidamount = '-';
			meta.Bidder_name = '-';
			if(Number(meta.min_bid) == Number(meta.bidincrement)){
				meta.bid_amount = meta.min_bid;
			} else {
				meta.bid_amount = meta.min_bid+(meta.bidincrement-(meta.min_bid%meta.bidincrement));
								 }
		} else {

			meta.bid_amount = Number(latestDetails['returnValues']['amount']) + Number(meta.bidincrement);
			if (Number(meta.bid_amount) > Number(meta.basePrice)) {
					meta.btnShow = false;
					meta.bidder_message = true;
					meta.bidder_message_content = "Base Price Reached"

				}
			meta.highestbidamount = latestDetails['returnValues']['amount'] ;
			meta.auction_endTime = latestDetails['returnValues']['auctionEndTime'];
			meta.setTime(latestDetails['returnValues']['auctionEndTime'])
			
			meta.grab.getUserName(latestDetails['returnValues']['bidder']).subscribe(res => {
				meta.Bidder_name = res['fullName'];
			});
		}
	}) 
	meta.check_bid_trigger();
  }

  check_bid_trigger(){
	  let meta = this;
	  meta.checkBid = setInterval(()=>{
		meta.grab.lastBidderDetails(meta.MyActiveDeal['auction_id']).then(latestDetails => {
			if (latestDetails == 'No Bid Logs Found') {
				meta.highestbidamount = '-';
				meta.Bidder_name = '-';
				if(Number(meta.min_bid) == Number(meta.bidincrement)){
					meta.bid_amount = meta.min_bid;
				} else {
					meta.bid_amount = Number(meta.min_bid)+(Number(meta.bidincrement)-(Number(meta.min_bid)%Number(meta.bidincrement)));
									 }
			} else {

				if (Number(latestDetails['returnValues']['auctionEndTime']) > Number(meta.auction_endTime)) {
					meta.bid_amount = Number(latestDetails['returnValues']['amount']) + Number(meta.bidincrement);
					if (Number(meta.bid_amount) > Number(meta.basePrice)) {
						meta.btnShow = false;
						meta.bidder_message = true;
						meta.bidder_message_content = "Base Price Reached"

					}
					meta.highestbidamount = latestDetails['returnValues']['amount'] ;
					meta.auction_endTime = latestDetails['returnValues']['auctionEndTime'];
					meta.setTime(latestDetails['returnValues']['auctionEndTime'])

					meta.grab.getUserName(latestDetails['returnValues']['bidder']).subscribe(res => {
						meta.Bidder_name = res['fullName'];
					})
				}
				
			}
		})
		meta.grab.auctionDetails(meta.auction_id).then(auction_det => {
			  // meta.required=Number(auction_det['bidBounds'][1]);
			  if(Number(meta.registered)<Number(auction_det['bidBounds'][3])){
				  meta.registered=Number(auction_det['bidBounds'][3]);
			  }
		});
}, 1000)
  }

  auction_conditions() {
  	let meta = this;
  	meta.grab.currentTime().then(CT =>{
  		if (Number(CT) < Number(meta.auction_endTime)) {

	  		if (Number(CT) < Number(meta.MyActiveDeal['reg_end'])) {
	  			meta.auctionReg = true;
				  meta.auctionLive = false;
	  			meta.setTime(meta.MyActiveDeal['reg_end'])
	  		} else {
	  			meta.auctionReg = false;
	  			if (Number(CT) < Number(meta.MyActiveDeal['auction_start'])) {
	  					meta.auctionLive = false;
	  					if (Number(meta.MyActiveDeal['req_bidders'])  <= Number(meta.registered)) {
	  						meta.auctionWait = true;
							  meta.minimumBiddersNotMeet = false;
	  						meta.setTime(meta.MyActiveDeal['auction_start'])
	  					} else {
	  						meta.auctionWait = false;
	  						meta.minimumBiddersNotMeet = true;
	  					}
	  				} else {
	  					
	  					if (Number(meta.MyActiveDeal['req_bidders'])  <= Number(meta.registered)) {
	  						meta.auctionLive = true;
	  						meta.minimumBiddersNotMeet = false;
	  						meta.auctionReg = false;
							  meta.auctionWait = false;
	  						meta.setTime(meta.auction_endTime);
	  					} else {
	  						meta.auctionReg = false;
		  					meta.auctionWait = false;
	  						meta.minimumBiddersNotMeet = true;
	  						meta.auctionLive = false;
	  					}
	  				} 
	  		}
	  	} else {
	  		meta.auctionExpired = true;
	  		meta.stopTimer()
	  		meta.stopCheck()
	  	}
  	})
  }

  manualBidding(){ 
  	let meta = this;
  	meta.grab.lastBidderDetails(meta.auction_id).then(res=>{
  		console.log(res)
  		if ("No Bid Logs Found" != res) {
	  		if(res['returnValues']['bidder'] == meta.grab._etherumAccountAddress) {
	  			meta.bidder_message = true;
	  			meta.bidder_message_content = "Currently you are the last Bidder"
	  		} else {
	  			meta.grab.balanceOf().then(grabitBalance => {
	  				if (Number(grabitBalance) >= Number(meta.bid_amount)) {
	  					meta.isTxProgressing = true;
	  					meta.grab.manualBidding(meta.auction_id,meta.bid_amount).then(bidding => {
							meta.isTxProgressing = false;
	  						if (bidding == 0 || bidding == 2) {
	  							meta.bidder_message = true;
	  							meta.bidder_message_content = "Transaction Failed Try Again"
	  						} else if(bidding == 1) {
	  							meta.bidder_message = true;
	  							meta.bidder_message_content = "Bid Placed"
	  						}
	  					})
	  				} else {
	  					meta.bidder_message = true;
	  					meta.bidder_message_content = "Insufficient Grraabit Balance"
	  				}
	  			})
	  		}
	  	} else {
	  		meta.grab.balanceOf().then(grabitBalance => {
	  				if (Number(grabitBalance) >= Number(meta.bid_amount)) {
						meta.isTxProgressing = true;
	  					meta.grab.manualBidding(meta.auction_id,meta.bid_amount).then(bidding => {
							meta.isTxProgressing = false;
	  						if (bidding == 0 || bidding == 2) {
	  							meta.bidder_message = true;
	  							meta.bidder_message_content = "Transaction Failed Try Again"
	  						} else if(bidding == 1) {
	  							meta.bidder_message = true;
	  							meta.bidder_message_content = "Bid Placed"
	  						}
	  					})
	  				} else {
	  					meta.bidder_message = true;
	  					meta.bidder_message_content = "Insufficient Grraabit Balance"
	  				}
	  			})
	  	}
  	});
    
  }

  hideMsg() {
  	this.bidder_message = false;
  	this.bidder_message_content = '';																																																									
  }

  setTime(time) {
	  let meta = this;
	  clearInterval(this.timer);
	  this.timer = undefined;
  	this.timer = setInterval(() => {
  		if ("00:00:00:00" == this.getTimeDiff(Number(time))) {
  			meta.stopTimer();
  			meta.auction_conditions();
  		} else {
  			this.displayTime = this.getTimeDiff(Number(time));		
  		}
      
      // this.displayTime = this.getTimeDiff('2019-02-01 00:00:00');
      }, 1000);
  }

  private getTimeDiff( datetime, useAsTimer = false ) {
      // datetime = new Date( datetime ).getTime();
      // console.log(new Date( datetime ).getTime())\
      datetime = datetime * 1000;
      var now = new Date().getTime();
  
      if( isNaN(datetime) )
      {
          return "";
      }

      var milisec_diff = datetime - now;
      if (useAsTimer) {
          milisec_diff = now - datetime;
      } 

      // Zero Time Trigger
      if (milisec_diff <= 0) {
      	// this.auction_conditions();
        this.zeroTrigger.emit("reached zero");
        return "00:00:00:00";
      }

      var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
      var date_diff = new Date( milisec_diff );
      var day_string = (days) ? this.twoDigit(days) + ":" : "";
      var day_hours = days * 24;


      if (this.timeOnly) {
        let hours = date_diff.getUTCHours() + day_hours;
        return  this.twoDigit(hours) +
        ":" + this.twoDigit(date_diff.getUTCMinutes()) + ":" 
        + this.twoDigit(date_diff.getUTCSeconds());
      } else {
        // Date() takes a UTC timestamp – getHours() gets hours in local time not in UTC. therefore we have to use getUTCHours()
        return day_string + this.twoDigit(date_diff.getUTCHours()) +
           ":" + this.twoDigit(date_diff.getUTCMinutes()) + ":" 
           + this.twoDigit(date_diff.getUTCSeconds());

      }
  }


  ngOnDestroy() {
    this.stopTimer();
    this.stopCheck();
  }

  private twoDigit(number: number) {
    return number > 9 ? "" + number: "0" + number;
  }

  private stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  private stopCheck() {
  	clearInterval(this.checkBid);
    this.checkBid = undefined;
  }
  removeElement(){
	this.ELEMENT_DATA=[];
	this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
	console.log('Remove')
  }
//   setnew(x){
	  
// 	  console.log(x);
// 	//   this.ELEMENT_DATA=x[0];
// 	this.ELEMENT_DATA.push(x)
// 	// [{
// 	// 	sno:1,
// 	// 	user:'shanthoshkumar',
// 	// 	price:'1008'
// 	// }];
// 	this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);  
// return;
// 	this.ELEMENT_DATA=
// 	[{
// 		sno:1,
// 		user:'shanthoshkumar',
// 		price:'1008'
// 	}];
// 	this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);  
// }

 
//   show_modal(){
// 	$('#exampleModalCenter').modal('show');
// 	  }

// 	  clear_array(){
// this.bid_details_array.length=0;
// 	  }

  bid_details() {
	  let meta = this;
	  meta.bid_details_array.length=0;
	  let tmp_array=[];
	  let total_content={};
  	  meta.grab.specific_bid_details(meta.auction_id).then(res =>{
			console.log(res);
			res.forEach((i,index)=>{
				let temp_obj={};
			meta.grab.getUserName(i["returnValues"].bidder).subscribe(name=> {
				temp_obj["sno"]=index+1;
				temp_obj["user"]=name['fullName'];
				temp_obj["price"]=i["returnValues"].amount;
				tmp_array.push(temp_obj);
				})
			})
			total_content['description']=meta.description;
			total_content['content']=tmp_array;
			// console.log(tmp_array);
			meta.deal.pop(total_content)
			
  	})
  }


}

export interface UserData {
	  sno: number;
	  user: string;
	  price: string;
	}
