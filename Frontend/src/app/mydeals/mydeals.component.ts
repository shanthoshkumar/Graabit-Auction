import { Component, OnInit,OnDestroy } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
// import { AppComponent } from '../app.component';
// import { MatTableDataSource } from "@angular/material/table";
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
declare let $:any;
// declare let simplyCountdown:any;
@Component({
  selector: 'app-mydeals',
  templateUrl: './mydeals.component.html',
  styleUrls: ['./mydeals.component.css']
})
export class MydealsComponent implements OnInit,OnDestroy {

    public mydealcontent:number;
    public myRegDealArray=[];
    public noActiveDeal:boolean = false;
    // public sec_shower:number[]=[];
    // public min_shower:number[]=[];
    // public hour_shower:number[]=[];
    // public last_bidder_message:boolean;
    // public basePrice_reached:boolean;
    // public bidPlacedMsg:boolean;
    // public bidNotPlacedMsg:boolean;
    public grabBalance:number;
    // public myExpDealArray=[];
    // public noMyExpDeal:boolean = false;
    public myActiveDealLength:number = 0;
    // public myExpDealLength:number = 0;
    public balance;
    public publickey;
    public paticipatedcount;
    public woncount;
    public credits;
    public username;
    public email;
    // public looper = [];
    // public looperindices = [];Admin123$
    public bidder_history=[];
    public description;
    public bidhistory =[];

    // public looper_indices_for_live = [];
    // public hour_shower_for_live:number[] = [];
    // public min_shower_for_live:number[] = [];
    // public sec_shower_for_live:number[] = [];
    // public looper_for_live = [];

    public no_bidder_history:boolean = false;
    public no_my_bid_logs:boolean = false;
    
    displayedColumns = ['sno','user','price' ];

    dataSource;
    product_description;
    modal_content=[];
    constructor(private grab:GrabitService,private route:Router) { 
        // let obj = {};
        // obj["productname"] = "Nokia";
        // obj["timeleft"] = "20:26:01";
        // obj["ipfsimghash"] = "QmS93z8tE8MHKGNv4RYvfA1ZaxNijLj7XDG6z2mfBfA3hW";
        // obj["highestbidamount"] = "2500";
        // obj["nextbidamount"] = "3000";
        // obj["timertext"] = "Hours";
        // this.myRegDealArray.push(obj);
        // this.myRegDealArray.push(obj);
        // this.myRegDealArray.push(obj);
        this.getAuctionID();
        this.load_credits();
        this.fetch_user_address();
        this.fetch_user_balance();
        this.paticipatedandwon();
        this.mydetails();
        
        // this.loadmyExpDealArray();
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

    bidlog(){
        let instance = this;
        instance.bidhistory = [];
        instance.no_my_bid_logs = true;
        instance.grab.event_Bidding().then(result => {
          result.forEach(element=>{
            if(element["returnValues"]["bidder"] == this.grab._etherumAccountAddress){
              instance.grab.getAuctionById(element["returnValues"]['auctionID']).subscribe(
                res=>{
                  let obj={};
                  obj['auctionid'] =element["returnValues"]['auctionID'];
                  obj['productname'] = res["productname"];
                  obj['amount'] = element["returnValues"]['amount'];
                  instance.no_my_bid_logs = false;
                  instance.bidhistory.push(obj);
                },
                err=>{
     
                }
              );
            }
          });
        })
      }
     
    get_history(id,desc){
        // console.log(id,desc)
        let meta = this;
        meta.description=desc;
        meta.bidder_history=[];
        meta.no_bidder_history = true;
        meta.grab.specific_bid_details(id).then(result=>{
          result.forEach(element => {
            meta.grab.getUserName(element["returnValues"].bidder).subscribe(res=>{
                // console.log(res);
                
              let obj={};
              obj['Price']=element["returnValues"].amount;
              obj['Name']=res['fullName'];
              meta.no_bidder_history = false;
              meta.bidder_history.push(obj);
            })
          });
        })
      }
   

//   setdealcontent(contentid){
//     let meta = this;
//     meta.mydealcontent = contentid;
//   }
setdealcontent(contentid){
    let meta = this;
    meta.mydealcontent = contentid;
    document.getElementById('1').classList.remove('active');
    document.getElementById('4').classList.remove('active');
    document.getElementById('6').classList.remove('active');
    document.getElementById('7').classList.remove('active');

    if(contentid == 6){
        meta.load_credits();
        meta.fetch_user_balance();
        meta.paticipatedandwon();
    }
    if(contentid == 4){
        // meta.loadmyExpDealArray();
    }
    // if(contentid == 1){
    //     meta.last_bidder_message=false;
    //     meta.basePrice_reached =false;
    //     meta.bidNotPlacedMsg = false;
    //     meta.bidPlacedMsg=false;
    // }
    if(contentid == 7){
        meta.bidlog();
    }
    document.getElementById(contentid).classList.add('active');
    // for(let i=1;i<=5;i++){
    //    if(i==contentid)
    //    {
    //        console.log('Add');
 
    //    document.getElementById(contentid).classList.add('active')
    //    }
    //    else
    //    {
    //        console.log('Remove');
 
    //     let x:any=i;
        
    //    }
    // }
  }
  navigateToUpcoming(){
      let meta = this;
      meta.grab.upcomingDivTarget = true;
  }

    // loadmyExpDealArray(){
    //     let instance = this;
    //     instance.myExpDealArray = [];
    //     instance.grab.getauctiondetails().then(details=>{
    //         details[0].forEach(a=>{
    //             let i=a+1;
    //             instance.grab.auctionDetails(i).then(result=>{
    //                 instance.grab.currentTime().then(now=>{
    //                     instance.grab.ispreregistered(i).then(isPreRegistered =>{
    //                         if(isPreRegistered == 1){
    //                             instance.grab.lastBidderDetails(i).then(newbid => {
    //                                 if(Number(result['times'][1]) <= Number(now)){
    //                                     if(Number(result['bidBounds'][1])<=Number(result['bidBounds'][3])){//expected met
    //                                         let obj2 ={};
    //                                         obj2['auctionid']=i;
    //                                         instance.grab.Particular_bid_details(i).then(totbidamt => {
    //                                             obj2["totalBidAmount"] = totbidamt;
    //                                         });//auctiondetails[6]==1 && auctiondetails[5][0]==bitteramount && bitteramount!=0){
    //                                         obj2["productname"] = details[1][a]['productname'];
    //                                         obj2["ipfsimghash"] = environment.api+'/static/'+details[1][a]['ipfshash'];
    //                                         obj2['description']=details[1][a]['description'];
                                            
    //                                         obj2['auctionid']=i;
    //                                         obj2["expDate"] = new Date(result['times'][1]*1000);
    //                                         obj2["winamount"] = 0;

    //                                         obj2["resettime"]=result['resetTime'];
    //                                         obj2["bidincrement"]=result['bidIncrement'];
    //                                         obj2["baseprice"]=result['basePrice'];
    //                                         obj2['required']=result['bidBounds'][1];
    //                                         obj2['registered']=result['bidBounds'][3];
    //                                         if(typeof(newbid)==typeof("string")){
    //                                             obj2["winner"] = "No One";
    //                                         }
    //                                         else{
    //                                             obj2["winamount"] = newbid['returnValues'].amount;  
    //                                             if(result[6] != 1){
    //                                                 obj2["winner"] = "Soon announced";
    //                                             } 
    //                                             else{
    //                                                 instance.grab.getUserName(newbid.returnValues.bidder).subscribe(username =>{
    //                                                     obj2["winner"] =username['fullName'];
    //                                                 })
    //                                             }
    //                                         }
    //                                         instance.noMyExpDeal = false;
    //                                         instance.myExpDealArray.push(obj2);                                            
    //                                         instance.myExpDealLength = instance.myExpDealArray.length;
    //                                     }
    //                                 }
    //                             })
    //                         }
    //                         if(details[0].length==i){
    //                             (()=>{
    //                                 setTimeout(()=>{
    //                                     if(instance.myExpDealArray.length == 0){
    //                                         instance.noMyExpDeal = true;
    //                                     }
    //                                 },200);
    //                             })();
    //                         }                            
    //                     })
    //                 })
    //             })
    //         })
    //         if(details[0].length==0){
    //             if(instance.myExpDealArray.length == 0){
    //                 instance.noMyExpDeal = true;
    //             }
    //         }               
    //     })
    // }

    private getAuctionID () {
        let meta = this;
        meta.myActiveDealLength = 0;
        meta.myRegDealArray = [];
        meta.grab.auctionList().then(res =>{
            res.forEach(auction_id => {
                meta.grab.ispreregistered(auction_id).then(isregistered =>{
                    let _regPenHash = meta.grab.regPenHash[auction_id];
                    if (Number(isregistered) == 1 || _regPenHash !== undefined) {
                        meta.grab.auctionDetails(auction_id).then(auctiondetail =>{
                            meta.grab.currentTime().then(CT =>{
                                if (CT < auctiondetail['times'][1]) {
                                    meta.grab.getAuctionById(auction_id).subscribe(auction_api => {
                                        // console.log(auction_api)
                                        let regPenHash = 'No Pending Hash';
                                        if(_regPenHash !== undefined){
                                            regPenHash = _regPenHash;
                                        }
                                        meta.myRegDealArray.push({
                                            'reg_end' : auctiondetail['times'][3],
                                            'auction_start' : auctiondetail['times'][0],
                                            'auction_end' : auctiondetail['times'][1],
                                            'auction_id' : auction_id,
                                            'bidincrement' : auctiondetail['bidIncrement'],
                                            'product_name' : auction_api['productname'],
                                            'ipfs' : environment.api+'/static/'+auction_api['ipfshash'],
                                            'req_bidders' : auctiondetail['bidBounds'][1],
                                            'reg_bidders' : auctiondetail['bidBounds'][3],
                                            'min_bid' : auctiondetail['bidBounds'][0],
                                            'base_price' : auctiondetail['basePrice'],
                                            'resettime' : auctiondetail['resetTime'],
                                            'description':auction_api['description'],
                                            'regPenHash':regPenHash
                                        })
                                        meta.myActiveDealLength++;
                                        console.log(meta.myRegDealArray)
                                    })
                                }
                            })
                        })
                    }
                })
            })
        })
    }


    load_credits(){
        let meta = this;
        meta.grab.balanceOf().then(result=>{
            meta.grabBalance  = result;
        })
      }

      //for  my account

      fetch_user_balance(){
        var instance =this;
        instance.grab.getEtherumAccountBalance().then(res =>{
            console.log("ether balance",res)
          instance.balance = res;
        });
      }
 
      fetch_user_address(){
        var instance =this;
        instance.publickey=instance.grab._etherumAccountAddress;
      }
 
      paticipatedandwon(){
        let instance = this;
        instance.paticipatedcount=0;
        instance.woncount=0;
        instance.grab.auctionList().then(a_ids=>{
          a_ids.forEach(id => {
            instance.grab.auctionDetails(id).then(auctiondetails=>{
              instance.grab.bidDetails(id).then(bitteramount=>{
                if(bitteramount!=0){
                  instance.paticipatedcount++;
                }
                if(auctiondetails[6]==1 && auctiondetails[5][0]==bitteramount && bitteramount!=0){
                  instance.woncount++;
                }
              })
            })
          });
        })
      }
 
      mydetails(){
        var instance =this;
        instance.grab.getuserthings().subscribe(
          res => {
            instance.username = res['user']['fullName'];
            instance.email = res['user']['email'];
          },
          err => {
            console.log(err.message);
          }
        );
      }

  ngOnInit() {
      let meta = this;
    //   if(meta.grab.isbidsuccess){
    //     meta.bidPlacedMsg=true;
    //     meta.load_credits();
    //   }
    if(this.route.url != '/mydeals/myexpdeals'){
        this.mydealcontent = 1;
        document.getElementById('1').classList.add('active');
    }
    else{
        this.mydealcontent = 4;
        document.getElementById('4').classList.add('active');
    }
    

    $(document).ready(function() {
        $('.owl-carousel').owlCarousel({
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
    })

    $(document).ready(function() {
        $(".dropdown").hover(
            function() {
                $('.dropdown-menu', this).stop(true, true).slideDown("fast");
                $(this).toggleClass('open');
            },
            function() {
                $('.dropdown-menu', this).stop(true, true).slideUp("fast");
                $(this).toggleClass('open');
            }
        );
    });

    $(document).ready(function($) {
        $(".scroll").click(function(event) {
            event.preventDefault();
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top
            }, 900);
        });
    });

    // $(document).ready(function() {
    //     $().UItoTop({
    //         easingType: 'easeOutQuart'
    //     });
    // });
    
  }
  ngOnDestroy(){
    //   let meta = this;
    //   meta.grab.isbidsuccess = false;
    //   meta.looperindices.forEach(index =>{
    //     clearInterval(meta.looper[index]);
    //   });
    //   meta.looper_indices_for_live.forEach(auctionid => {
    //     clearInterval(meta.looper_for_live[auctionid]);
    //   })
      
  }
//   bid_details(auction_id,description) {
//       console.log(auction_id,description)
//     let meta = this;
//     (document.getElementById('product_descript') as HTMLInputElement).innerText='';
//     let tmp: UserData[] = [];
//     (document.getElementById('product_descript') as HTMLInputElement).innerText=description;
//     meta.grab.specific_bid_details(auction_id).then(res =>{
//         res.forEach((item,index) =>{
//             meta.grab.getUserName(item["returnValues"].bidder).subscribe(name=> {
//                 tmp.push({
//                     sno : index+1,
//                     user : name['fullName'],
//                     price : item["returnValues"].amount
//                 });
                
//                 meta.dataSource = new MatTableDataSource(tmp);
//             })
//         })
//     })
// }

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
}
export interface UserData {
    sno: number;
    user: string;
    price: string;
  }