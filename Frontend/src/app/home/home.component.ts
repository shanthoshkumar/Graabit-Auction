import { Component, OnInit,OnDestroy } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
// import { AppComponent } from '../app.component';
// import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
declare let simplyCountdown:any;
declare let $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  
  

    //Edited
    
    public livDeals=[];
    public upcomingDeals=[];
    public closeddeals =[];
    // public live_array_list=[];
    // public closed_list=[];
    // public upcoming_array_list=[];
    // public closed_array_list=[];
    public triggerCarouselInterval;
    // public triggerIncrementer:number = 0;
    // public cantrigger:number= 0;
    public noActiveDeal:boolean = false;
    public noUpcomingDeal:boolean = false;
    public nocloseddeal:boolean = false;


    
  constructor(private grab:GrabitService){
    // ,private app:AppComponent,private route:Router) { 
    
    let meta=this;

    // meta.live_ids();
    // meta.upcoming_ids();
    // meta.closed_ids();
    meta.show_auctions_live()
    meta.show_auctions_upcoming()
    meta.show_auctions_closed()
    console.log(environment.api)
  }

  show_auctions_live(){
    let meta = this;
    meta.livDeals = [];
    meta.grab.lastliveauctionid = 0;
    meta.noActiveDeal = false;
    meta.grab.all_live_auctions().then(result_array=>{
        let a=0;
        result_array.forEach(data=>{
            a++;
            meta.grab.getAuctionById(data['auc_id']).subscribe(modbdet => {
                meta.grab.lastBidderDetails(data['auc_id']).then(lastBidDet => {
                    let liveObj = {};
                    liveObj['auction_id']=data['auc_id'];
                    liveObj['ipfsimghash']=environment.api+'/static/'+modbdet['ipfshash'];
                    liveObj['product_name']=modbdet['productname'];
                    liveObj['minimumbid']=data['bidBounds'][0];
                    liveObj['registered']=data['bidBounds'][3];
                    liveObj['required']=data['bidBounds'][1];
                    liveObj['resettime']=data['resetTime'];
                    liveObj['bidincrement']=data['bidIncrement'];
                    liveObj['basePrice']=data['basePrice'];
                    liveObj['isLive']=true;
                    liveObj['isRegMet']=Number(data['bidBounds'][3])>=Number(data['bidBounds'][1]);
                    liveObj['auctionEndTime']= data['times'][1];
                    if(lastBidDet != 'No Bid Logs Found'){
                        liveObj['auctionEndTime'] = lastBidDet.returnValues.auctionEndTime;
                        liveObj['nextbidamount'] = Number(lastBidDet.returnValues.amount)+Number(data['bidIncrement']);
                        liveObj['highestbidamount']=Number(lastBidDet.returnValues.amount);
                        liveObj['Bidder_address']=lastBidDet.returnValues.bidder;
                                   
                    }
                    else{
                        liveObj['Bidder_name']='-';
                        liveObj['Bidder_address']='-';
                        liveObj['highestbidamount']=0;
                        if(Number(data['bidBounds'][0]) == Number(data['bidIncrement'])){
                            liveObj['nextbidamount']=data['bidBounds'][0];
                        }
                        else{
                            liveObj['nextbidamount'] = Number(data['bidBounds'][0])+(Number(data['bidIncrement'])-(Number(data['bidBounds'][0])%Number(data['bidIncrement'])));
                        }
                    }
                    meta.grab.lastliveauctionid = data['auc_id'];
                    console.log("gonna push")
                    console.log(liveObj['nextbidamount'])
                    meta.livDeals.push(liveObj);
                })
            })
            if(result_array.length == a){
                setTimeout(()=>{
                    if(meta.livDeals.length == 0){
                        console.log("no live")
                        document.getElementById('progress_1').style.display='none';
                        document.getElementById('target_1').style.display='block';
                        meta.noActiveDeal = true;
                        meta.grab.triggerlive = true;   
                    }     
                },2000)
            }
        })
        if(result_array.length == 0){
            console.log("no live")
            document.getElementById('progress_1').style.display='none';
            document.getElementById('target_1').style.display='block';
            meta.noActiveDeal = true;
            meta.grab.triggerlive = true;
        }  
    })


  }

  show_auctions_upcoming(){
    let instance = this;
    instance.upcomingDeals = [];
    instance.grab.lastupcomingauctionid = 0;
    instance.noUpcomingDeal = false;
    instance.grab.all_upcoming_auctions().then(result_array=>{
        let a=0;
        result_array.forEach(data=>{
            a++;
            instance.grab.ispreregistered(data['auc_id']).then(isPreRegistered =>{
                instance.grab.currentTime().then(now=>{
                let obj ={};
                console.log(data)
                obj['auctionid']=data['auc_id'];
                obj['hash']=environment.api+'/static/'+data['ipfshash'];
                obj['productname']=data['productname'];
                obj['required']=data['bidBounds'][1];
                obj['registered']=data['bidBounds'][3];
                obj['aucstarttime']= new Date(data['times'][0]*1000);//bid start time
                obj['regstarttime'] = new Date(data['times'][2]*1000);
                obj['regendtime'] = new Date(data['times'][3]*1000);
                obj['minBid']=data['bidBounds'][0];
                obj['regtxt'] = 'register';
                obj['regbtnshow'] = true;
                obj['beforereg']=false;
                obj['isclosed'] = false;
                obj['timertxt'] = 2;
                obj['result']=data;
                obj['now']=now;
                obj['isPreRegistered']=isPreRegistered;
                let timeleftforregstart = Number(data['times'][2])-Number(now);
                obj['isTimeTextforregstart'] = Number(timeleftforregstart) > 86400;
                // 0 
                // 1 reg will start
                // 2 reg will end
                // 3 auction will start 
                let timeforrefresh = 0;//Number(result['times'][0]) - Number(now);
                if(Number(data['times'][2]) > Number(now)){
                //before registeration starts
                    timeforrefresh = Number(data['times'][2]) - Number(now);
                    
                // timeforrefresh = (timeforrefresh < _timeforrefresh)?_timeforrefresh:timeforrefresh;
                
                    if(Number(timeforrefresh) < 86400){
                        obj["isTimeText"] = false;
                        // instance.soon_reg_start_indices.push(i);
                    }
                    else{
                        obj["isTimeText"] = true;
                    }
                obj['regbtnshow'] = false;
                obj['beforereg'] = true;
                obj['timertxt'] = 1;
                }
                else if(Number(data['times'][3]) < Number(now)){
                    //after reg end and before live start
                timeforrefresh = Number(data['times'][0]) - Number(now);
                // timeforrefresh = (timeforrefresh < _timeforrefresh)?_timeforrefresh:timeforrefresh;
                obj["isRequiredmet"] =Number(obj['required'])<=Number(obj['registered']);
                
                if(data['bidBounds'][1]<=data['bidBounds'][3]){
                    if(Number(timeforrefresh) < 86400){
                        obj["isTimeText"] = false;
                        // instance.soon_auc_start_indices.push(i);
                    }
                    else{
                        obj["isTimeText"] = true;
                    }
                }
                obj['regbtnshow'] = false;
                obj['isclosed'] = true;
                obj['timertxt'] = 3;
                }
                else {
                if(isPreRegistered == 1){
                    obj['regtxt'] = 'registered';
                }
                timeforrefresh = Number(data['times'][3]) - Number(now);
                if(Number(timeforrefresh) < 86400){
                    obj["isTimeText"] = false;
                    // instance.soon_reg_end_indices.push(i);
                }
                else{
                    obj["isTimeText"] = true;
                }
                // timeforrefresh = (timeforrefresh < _timeforrefresh)?_timeforrefresh:timeforrefresh;
                }
                // if(instance.timeToRefresh != 0){
                //   if(instance.timeToRefresh > timeforrefresh){
                //     instance.timeToRefresh = timeforrefresh;
                //   }
                // }
                // else if(timeforrefresh != 0){
                //   instance.timeToRefresh = timeforrefresh;
                // }
                obj["carousel_array_length"] =instance.upcomingDeals.length;
                instance.grab.lastupcomingauctionid =data['auc_id'];
                instance.upcomingDeals.push(obj);
                })
              })
                if(result_array.length == a){
                    setTimeout(()=>{
                        if(instance.upcomingDeals.length == 0){
                            console.log("no upcoming")
                            instance.noUpcomingDeal = true;
                            document.getElementById('progress_2').style.display='none';
                            document.getElementById('target_2').style.display='block';
                                instance.grab.triggerupcoming = true;   
                            }   
                    },2000);
                }             
        })
        if(result_array.length ==0){
            console.log("no upcoming")
            instance.noUpcomingDeal = true;
            document.getElementById('progress_2').style.display='none';
            document.getElementById('target_2').style.display='block';
            instance.grab.triggerupcoming = true;            
        }
    })
}

  show_auctions_closed(){
      let instance = this;
      instance.closeddeals = [];
      instance.grab.all_closed_auctions().then(result_array=>{
          let a=0;
          result_array.forEach(data => {
              a++;
            let obj={};
                obj['auction_id']=data['auc_id'];
                obj['result']=data;
                obj['ipfsimghash']=environment.api+'/static/'+data['ipfshash'];
                obj['productname']=data['productname'];
                obj['required']=data['bidBounds'][1];
                obj['registered']=data['bidBounds'][3];
                obj['minBid']=data['bidBounds'][0];
                obj['ismeetrequired']=false;
                if(Number(data['bidBounds'][1]) <= Number(data['bidBounds'][3])){
                    obj['ismeetrequired']=true;
                }
             instance.grab.closedauctionid = data['auc_id'];
             instance.closeddeals.push(obj);
             if(result_array.length == a){
                    setTimeout(()=>{
                        if(instance.closeddeals.length == 0){
                            console.log("no closed")
                                instance.nocloseddeal = true;   
                                document.getElementById('progress_3').style.display='none';
                                document.getElementById('target_3').style.display='block';  
                                instance.grab.triggerclosed = true;   
                            }    
                    },2000);
            }
        });
        if(result_array.length == 0){
            console.log("no closed")
            instance.nocloseddeal = true;   
            document.getElementById('progress_3').style.display='none';
            document.getElementById('target_3').style.display='block';  
            instance.grab.triggerclosed = true;   
        }
    })
  }



  scrolltodiv(){
    let meta = this;
    $('html, body').animate({ scrollTop: $('#MyUpcomingElement').offset().top }, 'slow');
    meta.grab.upcomingDivTarget = false;
  }


/*
  live_ids(){
      let meta = this;
      meta.live_array_list = [];
      meta.grab.auctionList().then(auction_ids => {
          auction_ids.forEach(auction_id => {
              meta.grab.auctionDetails(auction_id).then(bchainaucdetails => {
                  meta.grab.currentTime().then(now_time => {
                      if(bchainaucdetails['times'][0]<now_time && bchainaucdetails['times'][1]>now_time){
                        meta.live_array_list.push(auction_id)
                    }
                  })
                })
              })
            })
  }

  upcoming_ids(){
    // upcoming_list
    let instance = this;
    instance.upcoming_array_list = [];
    instance.grab.getauctiondetails().then(details=>{
        details[0].forEach(a=>{
          let i=a+1;
          instance.grab.auctionDetails(i).then(result=>{
            instance.grab.currentTime().then(now=>{
              if(Number(result['times'][0]) > Number(now)){
                instance.upcoming_array_list.push(i);
                }
                })
              })
            })
        })
  } 

  closed_ids(){
        let instance = this;
        instance.closed_array_list = [];
        instance.grab.getauctiondetails().then(details=>{
            details[0].forEach(a=>{
                let i=a+1;
                instance.grab.auctionDetails(i).then(result=>{
                    instance.grab.currentTime().then(now=>{
                        if(Number(result['times'][1]) < Number(now)){
                            instance.closed_array_list.push(i);                        }
                    })
                })
            })
        })
  }
*/
triggerforlivecarousel(){
    console.log('cals');
  //   setTimeout(()=>{
      $('#target_1.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 2,
                nav: false
            },
            900: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4,
                nav: true,
                loop: false,
                margin: 20
            }
        }
    })
  //   },1000)

}
triggerforupcomingcarousel(){
    console.log('cals');
  //   setTimeout(()=>{
      $('#target_2.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 2,
                nav: false
            },
            900: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4,
                nav: true,
                loop: false,
                margin: 20
            }
        }
    })
  //   },1000)

}
triggerforclosedcarousel(){
    console.log('cals');
  //   setTimeout(()=>{
      $('#target_3.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 2,
                nav: false
            },
            900: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4,
                nav: true,
                loop: false,
                margin: 20
            }
        }
    })
  //   },1000)

}

  ngOnInit() {
    let meta = this;
    document.getElementById('target_1').style.display='none';
    document.getElementById('target_2').style.display='none';
    document.getElementById('target_3').style.display='none';
    let triggeredall:number = 0;
    meta.triggerCarouselInterval = setInterval(function(){ 
        if(meta.grab.triggerlive){
            meta.grab.triggerlive = false;
            triggeredall++;
            setTimeout(()=>{
                document.getElementById('progress_1').style.display='none';
                document.getElementById('target_1').style.display='block';
                $('#target_1').addClass("owl-carousel owl-theme owl-loaded owl-drag");
                meta.triggerforlivecarousel();
            },5000);
        }
        if(meta.grab.triggerupcoming){
            meta.grab.triggerupcoming = false;
            triggeredall++;
            setTimeout(()=>{
                document.getElementById('progress_2').style.display='none';
                document.getElementById('target_2').style.display='block';
                $('#target_2').addClass("owl-carousel owl-theme owl-loaded owl-drag");
                meta.triggerforupcomingcarousel();
            },5000)
        }
        if(meta.grab.triggerclosed){
            meta.grab.triggerclosed = false;
            triggeredall++;
            setTimeout(()=>{
                document.getElementById('progress_3').style.display='none';
                document.getElementById('target_3').style.display='block';
                $('#target_3').addClass("owl-carousel owl-theme owl-loaded owl-drag") 
                meta.triggerforclosedcarousel(); 
            },5000)
        }
        if(triggeredall == 3){
            clearInterval(meta.triggerCarouselInterval);
        }
    },1000);

    /*
        if((meta.live_array_list.length!=0) && ($("#parent_1 > div").length!=0))  //Live Deals 
        {
            if(meta.live_array_list.length==$("#parent_1 > div").length){
                console.log('Trigger');
                // alert('Live Deals')
                carouselIterator++;
                document.getElementById('progress_1').style.display='none';
                document.getElementById('target_1').style.display='block';
                $('#target_1').addClass("owl-carousel owl-theme owl-loaded owl-drag") 
                meta.triggerforcarousel();  
                if(carouselIterator == 3){
                    clearInterval(meta.triggerCarouselInterval);              
                }
            }
        }    
        if((meta.upcoming_array_list.length!=0) && ($("#parent_2 > div").length!=0))  //Upcoming Deals 
        {
            if(meta.upcoming_array_list.length==$("#parent_2 > div").length){
                console.log('Upcoming_Triggered');
                carouselIterator++;
                document.getElementById('progress_2').style.display='none';
                document.getElementById('target_2').style.display='block';
                $('#target_2').addClass("owl-carousel owl-theme owl-loaded owl-drag") 
                meta.triggerforcarousel();    
                if(carouselIterator == 3){
                    clearInterval(meta.triggerCarouselInterval);              
                }        
            }
        }
        if((meta.closed_array_list.length!=0) && ($("#parent_3 > div").length!=0))  //Closed Deals
        {
            if(meta.closed_array_list.length==$("#parent_3 > div").length){
                console.log('Trigger');
                carouselIterator++;
                document.getElementById('progress_3').style.display='none';
                document.getElementById('target_3').style.display='block';
                $('#target_3').addClass("owl-carousel owl-theme owl-loaded owl-drag") 
                meta.triggerforcarousel();     
                if(carouselIterator == 3){
                    clearInterval(meta.triggerCarouselInterval);              
                }       
            }
        }
            
        },1000); 
    */

    if(meta.grab.upcomingDivTarget){
      meta.scrolltodiv();
    }
    /*
        if(meta.grab.regnotifyshower != 0){
        if(meta.grab.regnotifyshower == 1){
            // meta.regreqsuccessnotify = true;
        }
        else if(meta.grab.regnotifyshower == 2){
            // meta.regreqfailnotify = true;
        }
        meta.grab.regnotifyshower = 0;
        }
    */
  }

  ngOnDestroy(){
    let meta = this;
    clearInterval(meta.triggerCarouselInterval);
    /*
        meta.soon_reg_start_indices.forEach(auctionid =>{
            clearInterval(meta.soon_reg_start_looper[auctionid]);
        });
        meta.looperindicesforliveend.forEach(auctionid => {
            clearInterval(meta.looperforliveend[auctionid]);
        })
        meta.soon_reg_end_indices.forEach(auctionid => {
            clearInterval(meta.soon_reg_end_looper[auctionid]);
        })
        meta.soon_auc_start_indices.forEach(auctionid => {
            // clearInterval(meta.soon_auc_live_start_timer[auctionid]);
        })
        clearTimeout(meta.refreshTimer);
    */

  }
}
