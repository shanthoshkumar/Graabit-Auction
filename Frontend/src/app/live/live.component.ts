import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
// import { AppComponent } from '../app.component';
@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  ​
  // @Input() start;
  @Input() end;
  @Output() zeroTrigger;
  @Input() timeOnly;
  @Input() liveDeal;
  timer: any;
  displayTime: any;
  liveInterval:any;
 ​
 ​
  // public auctionLive:boolean = false;
  // public auctionReg:boolean = true;
  // public minimumBiddersNotMeet:boolean = false;
  public auction_id:number;
  public ipfsimghash:string;
  public product_name:string;
  public minimumbid:number;
  public registered:number;
  public required:number;
  public resettime:number;
  public bidincrement:number;
  public basePrice:number;
  public Bidder_name:string;
  public highestbidamount:number;
  public isLive:boolean;
  public isRegMet:boolean;
  public nextbidamount:number;
  public auctionEndTime:number;
  public bidderAddress:string;
  public canShowNotification:boolean = false;
  public notificationContent:string='';
  public isBasePriceReached:boolean = false;
  public loginNotification:boolean = false;
  public canShowBiddedresult:boolean = false;
  public biddedresultContent:string = '';
  public progressing:boolean = false;
 ​
  constructor(
  //  private el: ElementRef,
   private grab:GrabitService,
  //  private app:AppComponent
 ​
  ) {
   this.zeroTrigger = new EventEmitter(true);
 ​
  }
 ​
  ngOnInit():void {
   
   let meta = this;
  //  console.log('home called',meta.liveDeal)
   meta.auction_id= Number(meta.liveDeal['auction_id']);
   if(meta.grab.lastliveauctionid == meta.auction_id){
     meta.grab.triggerlive = true;
   }
   meta.ipfsimghash= String(meta.liveDeal['ipfsimghash']);
   meta.product_name=String( meta.liveDeal['product_name']);
   meta.minimumbid= Number(meta.liveDeal['minimumbid']);
   meta.registered= Number(meta.liveDeal['registered']);
   meta.required= Number(meta.liveDeal['required']);
   meta.resettime= Number(meta.liveDeal['resettime']);
   meta.bidincrement= Number(meta.liveDeal['bidincrement']);
   meta.basePrice=Number(meta.liveDeal['basePrice']);
   if(meta.liveDeal['Bidder_address'] !='-'){
    meta.grab.getUserName(meta.liveDeal['Bidder_address']).subscribe(modbuserdetails => {
      console.log(modbuserdetails['fullName']);
      meta.Bidder_name=modbuserdetails['fullName'];
    })  
   }
   else{
      meta.Bidder_name = '-';
   }

  //  meta.Bidder_name=String(meta.liveDeal['Bidder_name']);
   meta.bidderAddress = String(meta.liveDeal['Bidder_address']);
   meta.highestbidamount= Number(meta.liveDeal['highestbidamount']);
   meta.isLive= Boolean(meta.liveDeal['isLive']);
   meta.isRegMet= Boolean(meta.liveDeal['isRegMet']);
   meta.displayTime= Number(meta.liveDeal['displayTime']);
   meta.nextbidamount= Number(meta.liveDeal['nextbidamount']);
   meta.auctionEndTime= Number(meta.liveDeal['auctionEndTime']);
   
   if(meta.liveDeal['isRegMet']){
    meta.setTime(meta.liveDeal['auctionEndTime']);
 ​
    meta.liveInterval = setInterval(()=>{
     meta.grab.currentTime().then(CT =>{
       meta.grab.lastBidderDetails(meta.auction_id).then(latestDetails => {
        if (latestDetails != 'No Bid Logs Found') {
         if (Number(latestDetails['returnValues']['auctionEndTime']) > meta.auctionEndTime) {
          meta.stopTimer();
          meta.auctionEndTime = Number(latestDetails['returnValues']['auctionEndTime']);
          meta.setTime(meta.auctionEndTime);
          meta.nextbidamount = Number(latestDetails['returnValues']['amount']) + meta.bidincrement;
          meta.highestbidamount = Number(latestDetails['returnValues']['amount']);
          meta.bidderAddress = String(latestDetails['returnValues']['bidder']);
          meta.grab.getUserName(latestDetails['returnValues']['bidder']).subscribe(res => {
           meta.Bidder_name = res['fullName'];
           if(meta.notificationContent == 'Currently You are the Last Bidder'){
            meta.dismissNotification();
           }
          })
         }
        }
        // else{
        //  // nobid logs found
        // }
        if (Number(meta.nextbidamount) > Number(meta.basePrice)) {
         //base Price Reached
         meta.isBasePriceReached = true;
        }
        if (Number(CT) > meta.auctionEndTime){
         //destroy timer
         meta.stopInterval();
         meta.stopTimer();
        }
       })
     })
    },1000);
   }
   else{
    //bidders not met 
   }
  }
 ​
  dismiss_canShowBiddedresult(){
   let instance = this;
   instance.canShowBiddedresult =false;
   instance.biddedresultContent ="";
  }
 ​
  dismiss_loginNotification(){
   let instance = this;
   instance.loginNotification = false;
  }
 ​
  manualBidding(){
   let instance = this;
   instance.dismiss_canShowBiddedresult();
   instance.dismissNotification();
   instance.dismiss_loginNotification();
   if(instance.grab._privateKey ==null ||instance.grab._privateKey =='' || instance.grab._privateKey == undefined){
    instance.loginNotification = true;
   }
   else{
    instance.grab.ispreregistered(instance.auction_id).then(_isPreRegistered => {
     if(_isPreRegistered == 1){
      //registered
      if(instance.bidderAddress!='-'){
       //last bidder exist
       if(instance.bidderAddress!=instance.grab._etherumAccountAddress){
        instance.grab.balanceOf().then(grabitBalance => {
         if(Number(grabitBalance)>=instance.nextbidamount){
          instance.progressing = true;
          instance.grab.manualBidding(instance.auction_id,instance.nextbidamount).then(bidTx => {
            instance.progressing = false;
           instance.canShowBiddedresult =true;
           if(bidTx==1){
            //Transaction Success
            instance.biddedresultContent ="Bid Placed";
           }
           else{
            //Transaction Failed Try Again
            instance.biddedresultContent ="Transaction Failed. Try Again";
           }
          })
         }
         else{
          //don't have enough bid pack
          instance.canShowNotification = true;
          instance.notificationContent ="You don't have enough bid pack";
         }
        })
       }
       else{
        //you are the last bidder
        instance.canShowNotification = true;
        instance.notificationContent ="Currently you are the last bidder";
       }
      }
      else{
       //first bidder
       instance.grab.balanceOf().then(grabitBalance => {
        if(Number(grabitBalance)>=instance.nextbidamount){
          instance.progressing = true;
         instance.grab.manualBidding(instance.auction_id,instance.nextbidamount).then(bidTx => {
          instance.progressing = false;
          instance.canShowBiddedresult =true;
          if(bidTx==1){
           //Transaction Success
           instance.biddedresultContent ="Bid Placed";
          }
          else{
           //Transaction Failed Try Again
           instance.biddedresultContent ="Transaction Failed. Try Again";
          }
         })
        }
        else{
         //don't have enough bid pack
         instance.canShowNotification = true;
         instance.notificationContent ="You don't have enough bid pack";
        }
       })
      }
     }
     else{
      //Not Registered
      instance.canShowNotification = true;
      instance.notificationContent ="You Didn't Register For This Auction";
     }
    })
   }
  }
 ​
  dismissNotification(){
   let meta = this;
   meta.canShowNotification = false;
   meta.notificationContent = '';
  }
 ​
  setTime(time) {
    let meta = this;
    this.timer = setInterval(() => {
    this.displayTime = this.getTimeDiff(Number(time));
    // this.displayTime = this.getTimeDiff('2019-02-01 00:00:00');
    }, 1000);
  }
 ​
  private getTimeDiff( datetime, useAsTimer = false ) {
    // datetime = new Date( datetime ).getTime();
    // console.log(new Date( datetime ).getTime())\
    datetime = datetime * 1000;
    var now = new Date().getTime();
  
    if( isNaN(datetime) )
    {
      return "";
    }
 ​
    var milisec_diff = datetime - now;
    if (useAsTimer) {
      milisec_diff = now - datetime;
    } 
 ​
    // Zero Time Trigger
    if (milisec_diff <= 0) {
     this.zeroTrigger.emit("reached zero");
     return "00:00:00:00";
    }
 ​
    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
    var date_diff = new Date( milisec_diff );
    var day_string = (days) ? this.twoDigit(days) + ":" : "";
    var day_hours = days * 24;
 ​
 ​
    if (this.timeOnly) {
     let hours = date_diff.getUTCHours() + day_hours;
     return this.twoDigit(hours) +
     ":" + this.twoDigit(date_diff.getUTCMinutes()) + ":" 
     + this.twoDigit(date_diff.getUTCSeconds());
    } else {
     // Date() takes a UTC timestamp – getHours() gets hours in local time not in UTC. therefore we have to use getUTCHours()
     return day_string + this.twoDigit(date_diff.getUTCHours()) +
       ":" + this.twoDigit(date_diff.getUTCMinutes()) + ":" 
       + this.twoDigit(date_diff.getUTCSeconds());
 ​
    }
  }
 ​
 ​
  ngOnDestroy() {
   this.stopTimer();
   this.stopInterval();
  }
 ​
  private twoDigit(number: number) {
   return number > 9 ? "" + number: "0" + number;
  }
 ​
  private stopTimer() {
   clearInterval(this.timer);
   this.timer = undefined;
  }
 ​
  private stopInterval(){
   let meta = this;
   meta.isLive = false;
   clearInterval(meta.liveInterval);
   meta.liveInterval = undefined;
  }

}
