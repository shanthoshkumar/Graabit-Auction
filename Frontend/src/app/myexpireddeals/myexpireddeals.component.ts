import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { environment } from 'src/environments/environment';
declare let $:any;

@Component({
  selector: 'app-myexpireddeals',
  templateUrl: './myexpireddeals.component.html',
  styleUrls: ['./myexpireddeals.component.css']
})
export class MyexpireddealsComponent implements OnInit {
  public myExpDealArray=[];
  public noMyExpDeal:boolean = false;
  // public myExpDealLength:number = 0;

  // dataSource;
  product_description;
  modal_content=[];
  constructor(private grab:GrabitService) { }

  ngOnInit() {
    let meta = this;
    meta.loadmyExpDealArray();
  }
  
  bid_details(auction_id,_description) {
    console.log(auction_id,_description)
  let meta = this;
  let tmp_array=[];
  let total_content={};
  meta.grab.specific_bid_details(auction_id).then(res =>{
      res.forEach((item,index) =>{
        let temp_obj={};
          meta.grab.getUserName(item["returnValues"].bidder).subscribe(name=> {
            temp_obj["sno"]=index+1;
            temp_obj["user"]=name['fullName'];
            temp_obj["price"]=item["returnValues"].amount;
            tmp_array.push(temp_obj);
              });
          })
          total_content['description']=_description;
          total_content['content']=tmp_array;
          // console.log(tmp_array);
          meta.pop(total_content)
      })
  }

  pop(obj){
    this.modal_content.length=0;
    document.getElementById('descript').innerText='';
    console.log(obj['content'])
    console.log(obj['description'])
    document.getElementById('descript').innerText=obj['description'];
    this.product_description=obj['description']
    this.modal_content=obj['content'];
    $('#child_content_modal').modal('show');
  }

  loadmyExpDealArray(){
    let instance = this;
    instance.myExpDealArray = [];
    instance.grab.getauctiondetails().then(details=>{
        details[0].forEach(a=>{
            let i=a+1;
            instance.grab.auctionDetails(i).then(result=>{
                instance.grab.currentTime().then(now=>{
                    instance.grab.ispreregistered(i).then(isPreRegistered =>{
                        if(isPreRegistered == 1){
                            instance.grab.lastBidderDetails(i).then(newbid => {
                                if(Number(result['times'][1]) <= Number(now)){
                                    if(Number(result['bidBounds'][1])<=Number(result['bidBounds'][3])){//expected met
                                        let obj2 ={};
                                        obj2['auctionid']=i;
                                        instance.grab.Particular_bid_details(i).then(totbidamt => {
                                            obj2["totalBidAmount"] = totbidamt;
                                        });//auctiondetails[6]==1 && auctiondetails[5][0]==bitteramount && bitteramount!=0){
                                        obj2["productname"] = details[1][a]['productname'];
                                        obj2["ipfsimghash"] = environment.api+'/static/'+details[1][a]['ipfshash'];
                                        obj2['description']=details[1][a]['description'];
                                        
                                        obj2['auctionid']=i;
                                        obj2["expDate"] = new Date(result['times'][1]*1000);
                                        obj2["winamount"] = 0;

                                        obj2["resettime"]=result['resetTime'];
                                        obj2["bidincrement"]=result['bidIncrement'];
                                        obj2["baseprice"]=result['basePrice'];
                                        obj2['required']=result['bidBounds'][1];
                                        obj2['registered']=result['bidBounds'][3];
                                        if(typeof(newbid)==typeof("string")){
                                            obj2["winner"] = "No One";
                                        }
                                        else{
                                            obj2["winamount"] = newbid['returnValues'].amount;  
                                            if(result[6] != 1){
                                                obj2["winner"] = "Soon announced";
                                            } 
                                            else{
                                                instance.grab.getUserName(newbid.returnValues.bidder).subscribe(username =>{
                                                    obj2["winner"] =username['fullName'];
                                                })
                                            }
                                        }
                                        instance.noMyExpDeal = false;
                                        instance.myExpDealArray.push(obj2);                                            
                                        instance.grab.myExpDealLength = instance.myExpDealArray.length;
                                    }
                                }
                            })
                        }
                        if(details[0].length==i){
                            (()=>{
                                setTimeout(()=>{
                                    if(instance.myExpDealArray.length == 0){
                                        instance.noMyExpDeal = true;
                                    }
                                },200);
                            })();
                        }                            
                    })
                })
            })
        })
        if(details[0].length==0){
            if(instance.myExpDealArray.length == 0){
                instance.noMyExpDeal = true;
            }
        }               
    })
}

}
