import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';

@Component({
  selector: 'app-registrationdetails',
  templateUrl: './registrationdetails.component.html',
  styleUrls: ['./registrationdetails.component.css']
})
export class RegistrationdetailsComponent implements OnInit {

  public auctiondet=[];
 public regdet=[];
 public auction_ID:number=0;
   constructor(private grab:GrabitService) { }

   auctionDetails(){
     var ins=this;
     ins.auctiondet = [];
     ins.grab.getauctiondetails().then(details=>{
       details[0].forEach(a=>{
         let i=a+1;
           let obj1={}
           obj1["_Auctionid"]=i;
           obj1["Productname"]=details[1][a]["productname"]
           ins.auctiondet.push(obj1)
         })
       })
     }

   registrationDetails(auctionid){
     var ins=this;
     var noresult=(document.getElementById("noresult")as HTMLParagraphElement);
       noresult.hidden=true;
         ins.auction_ID=auctionid;
         ins.regdet = [];
         ins.grab.auctionDetails(auctionid).then(result=>{
           ins.grab.registeredListForAuction(auctionid).then(res=>{
           if(res.length==0){
             noresult.hidden=false;
             noresult.innerText="No one registered on this Auction";
           }
           else
           {
             res.forEach(userAddress => {
               let obj={};
             obj["Address"]=userAddress;
             obj["minbid"]=result["bidBounds"][0];
             ins.regdet.push(obj);
             });
           }
         })
       })
     }
   ngOnInit() {
     this.auctionDetails();
   }

 }