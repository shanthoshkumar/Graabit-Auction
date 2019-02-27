import { Component,Input, OnInit , OnDestroy} from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
// declare let $:any;
@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit,OnDestroy {
    @Input() start
    @Input() end;

    public soon_reg_start_indices;
    public soon_reg_start_sec_shower:number;
    public soon_reg_start_min_shower:number;
    public soon_reg_start_hour_shower:number;
    public soon_reg_start_looper ;

    public soon_reg_end_indices ;
    public soon_reg_end_sec_shower:number;
    public soon_reg_end_min_shower:number;
    public soon_reg_end_hour_shower:number;
    public soon_reg_end_looper ;

    public soon_auc_start_indices;
    public soon_auc_start_sec_shower:number;
    public soon_auc_start_min_shower:number;
    public soon_auc_start_hour_shower:number;
    public soon_auc_start_looper;

    // public alreadyRegistered:boolean = false;
    // public buybidpacknotify:boolean = false;
    // public uradminnotify:boolean = false;
    // public regreqsuccessnotify:boolean = false;
    // public regreqfailnotify:boolean = false;
    public carousel_array_length;
    public block={};

    notification:boolean = false;
    notification_content:string='';
    isUpcoming:boolean = true;
    constructor(private grab:GrabitService,private route:Router,private app:AppComponent) { }

    dismiss_notification(){
        let meta = this;
        meta.notification = false;
        meta.notification_content = '';
    }

    preregisteration(auctionid,registeramount){
        let meta = this;
        console.log("clicked",Date.now())
        meta.dismiss_notification();
        if(meta.grab._privateKey =='' || meta.grab._privateKey == undefined){
            meta.notification = true;
            meta.notification_content = 'Login To Continue';
        }
        else{
            //preregister
            meta.grab.owner().then(owner => {
                if(!(owner == meta.grab._etherumAccountAddress)){
                    meta.grab.ispreregistered(auctionid).then(_isPreRegistered => {
                        if(_isPreRegistered == 1){
                            //already registered
                            meta.notification = true;
                            meta.notification_content = 'Already Registered';
                        }
                        else{
                            //preRegisteration
                            if(meta.grab.regPenHash[auctionid]===undefined){
                                meta.grab.balanceOf().then(grabitBalance => {
                                    if(Number(grabitBalance)>=Number(registeramount)){
                                            meta.grab.preregister(auctionid);
                                        // .then(res => {
                                          
                                        // if(res == 1){
                                        //     meta.route.navigate(['/mydeals']);
                                        // }
                                        // else{
                                        //     meta.notification = true;
                                        //     meta.notification_content = 'Transaction Failed!';
                                        // }
                                    // });
                                    }
                                    else{
                                        meta.notification = true;
                                        meta.notification_content = "Insufficient Bid Pack Balance";
                                    }
                                });
                            }
                            else{
                                meta.route.navigate(['/mydeals']);
                            }
                        }
                    });
                }
                else{
                    //You are admin
                    meta.notification = true;
                    meta.notification_content = "Admin Can't Register";
                }
            });
        }
    }

    soon_auc_reg_starttimer(auctionid,timeforregstart,carousel_length){
        let meta =  this;
        let timeLeft = timeforregstart;
        meta.soon_reg_start_sec_shower=timeLeft%60;
        let min_str:string = (timeLeft/60).toString();
        let min = min_str.split(".");
        let minutes=Number(min[0])
        meta.soon_reg_start_min_shower=minutes%60;
        let hours_str:string = (timeLeft/3600).toString();
        let hours= hours_str.split(".");
        meta.soon_reg_start_hour_shower = Number(hours[0]);

        meta.soon_reg_start_looper = setInterval(()=>{
            if(meta.soon_reg_start_hour_shower ==0 && meta.soon_reg_start_min_shower==0 && meta.soon_reg_start_sec_shower==0)
            {
               clearInterval(meta.soon_reg_start_looper); 
                
                meta.block['timertxt'] =2;
                meta.grab.auctionDetails(auctionid).then(result => {
                    meta.grab.currentTime().then(now=>{
                        let __timeLeft = Number(result['times'][3])-Number(now);
                        meta.block['regbtnshow']= true;
                        if(__timeLeft<86400){
                            meta.block['isTimeText'] = false;
                            meta.soon_reg_end_indices = auctionid;
                            meta.soon_auc_reg_endtimer(auctionid,__timeLeft,carousel_length)    
                        }
                        else{
                            meta.block['isTimeText'] = true;
                        }
                    })
                })                 
            }
            if(meta.soon_reg_start_sec_shower!=0){
                meta.soon_reg_start_sec_shower--;
            }
            else{
                if(meta.soon_reg_start_hour_shower !=0 || meta.soon_reg_start_min_shower!=0 ){
                    meta.soon_reg_start_sec_shower=59;
                    if(meta.soon_reg_start_min_shower != 0){
                        meta.soon_reg_start_min_shower--;
                    }
                    else{
                        if(meta.soon_reg_start_hour_shower !=0){
                            meta.soon_reg_start_min_shower = 59;
                            meta.soon_reg_start_hour_shower--;
                        } 
                        else {
                            
                        }
                    }
                }
            }
        
        },1000);
    }

    // navigatetohome(){
    //     let meta = this;
    //     meta.navigateToUpcoming();
    //     meta.route.navigate(['/signingout']);
    // }
  
    navigateToUpcoming(){
        let meta = this;
        meta.grab.upcomingDivTarget = true;
    }

    soon_auc_live_start_timer(auctionid,timeforauclivestart){
        let meta =  this;
        let timeLeft = timeforauclivestart;
        meta.soon_auc_start_sec_shower=timeLeft%60;
        let min_str:string = (timeLeft/60).toString();
        let min = min_str.split(".");
        let minutes=Number(min[0])
        meta.soon_auc_start_min_shower=minutes%60;
        let hours_str:string = (timeLeft/3600).toString();
        let hours= hours_str.split(".");
        meta.soon_auc_start_hour_shower = Number(hours[0]);

        meta.soon_auc_start_looper = setInterval(()=>{
            if(meta.soon_auc_start_hour_shower ==0 && meta.soon_auc_start_min_shower==0 && meta.soon_auc_start_sec_shower==0)
            {
                clearInterval(meta.soon_auc_start_looper); 
                meta.block['regbtnshow'] =false;
                meta.isUpcoming = false;
            }
            if(meta.soon_auc_start_sec_shower!=0){
                meta.soon_auc_start_sec_shower--;
            }
            else{
                if(meta.soon_auc_start_hour_shower !=0 || meta.soon_auc_start_min_shower !=0 ){
                    meta.soon_auc_start_sec_shower=59;
                    if(meta.soon_auc_start_min_shower != 0){
                        meta.soon_auc_start_min_shower --;
                    }
                    else{
                        if(meta.soon_auc_start_hour_shower !=0){
                            meta.soon_auc_start_min_shower = 59;
                            meta.soon_auc_start_hour_shower--;
                        } 
                        else {
                            
                        }
                    }
                }
            }
        },1000);
    }

    soon_auc_reg_endtimer(auctionid,timeforregend,carousel_length){
        let meta =  this;
        let timeLeft = timeforregend;
        meta.soon_reg_end_sec_shower=timeLeft%60;
        let min_str:string = (timeLeft/60).toString();
        let min = min_str.split(".");
        let minutes=Number(min[0])
        meta.soon_reg_end_min_shower=minutes%60;
        let hours_str:string = (timeLeft/3600).toString();
        let hours= hours_str.split(".");
        meta.soon_reg_end_hour_shower = Number(hours[0]);

        meta.soon_reg_end_looper = setInterval(()=>{

            meta.grab.auctionDetails(auctionid).then(result =>{
                meta.block['registered']=result['bidBounds'][3];
                meta.block['required']=result['bidBounds'][1];
            });
            if(meta.soon_reg_end_hour_shower ==0 && meta.soon_reg_end_min_shower==0 && meta.soon_reg_end_sec_shower==0)
            {
                clearInterval(meta.soon_reg_end_looper); 
                meta.grab.auctionDetails(auctionid).then(result =>{
                    if(result['bidBounds'][1]<=result['bidBounds'][3]){
                    meta.block['isRequiredmet'] = true;
                    meta.grab.currentTime().then(now =>{
                        let __timeforauclivestart = Number(result['times'][0])-Number(now);
                        meta.soon_auc_live_start_timer(auctionid,__timeforauclivestart)
                    });
                    }
                    else{
                        meta.block['isRequiredmet'] = false;
                        meta.block['isclosed'] = true;
                    }
                })
                meta.block['regbtnshow'] =false;
                meta.block['timertxt'] =3;
                
            }
            if(meta.soon_reg_end_sec_shower!=0){
                meta.soon_reg_end_sec_shower--;
            }
            else{
                if(meta.soon_reg_end_hour_shower !=0 || meta.soon_reg_end_min_shower !=0 ){
                    meta.soon_reg_end_sec_shower=59;
                    if(meta.soon_reg_end_min_shower != 0){
                        meta.soon_reg_end_min_shower--;
                    }
                    else{
                        if(meta.soon_reg_end_hour_shower !=0){
                            meta.soon_reg_end_min_shower = 59;
                            meta.soon_reg_end_hour_shower--;
                        } 
                        else {
                            
                        }
                    }
                }
            }
        },1000);
    }


    // triggerforcarousel(){
    //     $('.owl-carousel').owlCarousel({
    //         loop: true,
    //         margin: 10,
    //         responsiveClass: true,
    //         responsive: {
    //             0: {
    //                 items: 1,
    //                 nav: true
    //             },
    //             600: {
    //                 items: 2,
    //                 nav: false
    //             },
    //             900: {
    //                 items: 3,
    //                 nav: false
    //             },
    //             1000: {
    //                 items: 4,
    //                 nav: true,
    //                 loop: false,
    //                 margin: 20
    //             }
    //         }
    //     })
    // }

  ngOnInit() {
      let data=this.start;
        let instance = this;
        instance.block={};
        instance.carousel_array_length = data.carousel_array_length; 
                    let obj ={};
                    obj['auctionid']=data.auctionid;
                    obj['hash']=data.hash;
                    obj['required']=data.required;
                    obj['registered']=data.registered;
                    obj['aucstarttime']=data.aucstarttime;
                    obj['productname'] = data.productname;
                    if(instance.grab.lastupcomingauctionid == data.auctionid){
                        instance.grab.triggerupcoming = true;
                    }
                    obj['regstarttime'] =data.regstarttime;
                    obj['regendtime'] =data.regendtime;
                    obj['minBid']=data.minBid;
                    obj['regtxt'] =data.regtxt;
                    obj['regbtnshow'] =data.regbtnshow;
                    obj['beforereg']=data.beforereg;
                    obj['isclosed'] = data.isclosed;
                    obj['timertxt'] = data.timertxt;
                    let timeleftforregstart = Number(data.result['times'][2])-Number(data.now);
                    obj['isTimeTextforregstart'] = Number(timeleftforregstart) > 86400;
                    let timeforrefresh = 0;
                    if(Number(data.result['times'][2]) > Number(data.now)){
                        timeforrefresh = Number(data.result['times'][2]) - Number(data.now);
                       if(Number(timeforrefresh) < 86400){
                            obj["isTimeText"] = false;
                            instance.soon_reg_start_indices = data.auctionid;
                            instance.soon_auc_reg_starttimer(data.auctionid,timeforrefresh,instance.carousel_array_length);
                       }
                       else{
                            obj["isTimeText"] = true;
                        }
                      obj['regbtnshow'] = false;
                      obj['beforereg'] = true;
                      obj['timertxt'] = 1;
                    }
                    else if(Number(data.result['times'][3]) < Number(data.now)){
                      timeforrefresh = Number(data.result['times'][0]) - Number(data.now);
                      obj["isRequiredmet"] =Number(obj['required'])<=Number(obj['registered']);
                      
                      if(data.result['bidBounds'][1]<=data.result['bidBounds'][3]){
                          if(Number(timeforrefresh) < 86400){
                            obj["isTimeText"] = false;
                            instance.soon_auc_start_indices = data.auctionid;
                            instance.soon_auc_live_start_timer(data.auctionid,timeforrefresh);
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
                      if(data.isPreRegistered == 1){
                        obj['regtxt'] = 'registered';
                      }
                      timeforrefresh = Number(data.result['times'][3]) - Number(data.now);
                      if(Number(timeforrefresh) < 86400){
                        obj["isTimeText"] = false;
                        instance.soon_reg_end_indices = data.auctionid;
                        console.log(data.auctionid,timeforrefresh,instance.carousel_array_length);
                        
                        instance.soon_auc_reg_endtimer(data.auctionid,timeforrefresh,instance.carousel_array_length);
                      }
                      else{
                        obj["isTimeText"] = true;
                      }
                    }

                    instance.block=obj;               
      } 
      ngOnDestroy(){
        let meta = this;
        
        meta.soon_reg_start_indices = 0;
        meta.soon_reg_start_sec_shower = 0;
        meta.soon_reg_start_min_shower = 0;
        meta.soon_reg_start_hour_shower = 0;
        meta.soon_reg_end_indices = 0;
        meta.soon_reg_end_sec_shower = 0;
        meta.soon_reg_end_min_shower = 0;
        meta.soon_reg_end_hour_shower = 0;
        meta.soon_auc_start_indices = 0;
        meta.soon_auc_start_sec_shower = 0;
        meta.soon_auc_start_min_shower = 0;
        meta.soon_auc_start_hour_shower = 0;
        meta.carousel_array_length = 0;
        meta.block={};
        meta.notification = false;
        meta.notification_content='';
        meta.isUpcoming = false;
        clearInterval(meta.soon_reg_start_looper)
        clearInterval(meta.soon_reg_end_looper)
        clearInterval(meta.soon_auc_start_looper)

      }
      

}
