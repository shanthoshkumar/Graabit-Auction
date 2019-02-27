import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-setresult',
  templateUrl: './setresult.component.html',
  styleUrls: ['./setresult.component.css']
})
export class SetresultComponent implements OnInit {
  public finalizenotify:number = 0;
  public  finalizeresult=[];
  // public bid_id;
    constructor(private grabit:GrabitService,private app:AppComponent) {
      this.setresulttable();
      this.finalizenotify=0;
    }
  
    setresulttable(){
      var meta=this;
      meta.finalizenotify=0;
      meta.finalizeresult.length=0;
      meta.grabit.currentTime().then(now_time => {
        meta.grabit.getauctiondetails().then(actionDetail=>{
          var array:any = actionDetail[1];
          for(let i=0;i<array.length;i++){         
            meta.grabit.auctionDetails(actionDetail[1][i]['auctionid']).then(auctions=>{ 
              if(now_time > auctions[0][1] ){ 
                  let obj={};
                  obj['auctionid'] =actionDetail[1][i]['auctionid'];
                  obj['productname'] = actionDetail[1][i]['productname'];
                  let st:any =auctions[0][0];
                  let starttime:any = new Date(st*1000);
                  obj['start_time'] =starttime;
                  let endt:any =auctions[0][1];
                  let endtime:any = new Date(endt*1000);
                  obj["end_time"]=endtime;
                  obj["basePrice"]=auctions[1];
                  obj["bidIncrement"]=auctions[2];
                  obj["minBid"]=auctions[3][0];
                  obj["resetTime"]=auctions[4];
                  obj["lastBidDetails_amount"]=auctions[5][0];
                  meta.grabit.lastBidderDetails(actionDetail[1][i]['auctionid']).then(event_result=>{
                  if(event_result!='No Bid Logs Found'){            
                    meta.grabit.getUserName(event_result['returnValues'].bidder).subscribe(res => { 
                      obj["lastBidder"]=res['fullName'];
                    })
                  }
                  else{
                    obj["lastBidder"]="No Bidders";
                  }
                })
                if(auctions[6]==1){
                  obj['buttonshow']  = true;
                }
                // let bt:any =auctions[5][1];
                // let lastbettime:any = new Date(bt*1000);
                // obj["lastBidDetails_time"]=lastbettime;
                meta.finalizeresult.push(obj);
              }
            })
          }
        })
      })  
    }
    alertClose(){
      let instance = this;
      instance.finalizenotify=0;
    }
    setresult(_aid){
      let instance = this;
      instance.finalizenotify=0;
      instance.app.spinner.show();
      instance.grabit.finalizeAuction(_aid).then(res=>{
        instance.app.spinner.hide();
        // instance.bid_id=_aid;
        document.documentElement.scrollTop = 0;
        if(res == 1) {
          instance.setresulttable();
          instance.finalizenotify=1;
          
        }
        else if(res == 0) {
          instance.finalizenotify=2;
        }
        else if(res == 2) {
          instance.finalizenotify=2;
        }
      })
    }
  
    ngOnInit() {
    }
  
  }
