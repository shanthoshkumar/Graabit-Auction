import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css']
})
export class CreateAuctionComponent implements OnInit {

  filepath;
  public selectedFile: any;
  public show_revert_error:boolean;
  public show_valid:boolean;
  public baseprice_error:number = 0;
  public least_baseprice:number;
  public minimumbid_error:boolean;
  public reset_time_error:boolean;
  public successful_message:boolean;
  public bid_increment_error:boolean;
  public imgagefield:boolean=true;
  public auction = [];
  public selected_aid=[];
  public selected_hash;
  public productid;
  public btnname:boolean=false;
  public title='Create';
  public auctionnotify:number = 0;
  public checktimeerror:boolean = false;
  public description;
  // public successful_message:boolean;
  // public show_valid:boolean;
  // public show_revert_error:boolean;
  // fd = new FormData();


  //for image upload
  // imgbuff;

  currentFileUpload: File;

  constructor (private grab:GrabitService,private http:HttpClient,private app:AppComponent) {
    this.show_revert_error=false;
    this.show_valid=false;
    this.baseprice_error=0;
    this.reset_time_error=false;
    this.successful_message=false;
    this.bid_increment_error=false;
   
    
  }

//   onFileChanged(event){
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = this.handleReaderLoaded.bind(this);
//       reader.readAsBinaryString(file);
//       // console.log(reader)
//     }
// }    
  
    onFileChanged(event){
      this.currentFileUpload = event.target.files[0];
    }
    // cal(){
    //   let fr = new FileReader();
    //   let meta = this;
    //   fr.onload = function(e){
    //     meta.imgbuff = fr.result;
    //     // console.log(Buffer.from(ins.imgbuff))
    //     // console.log(JSON.stringify(meta.imgbuff));
    //     // return;
    //     // return;
    //     let fieldname = "media_empty";
    //     let originalfile = "originalfile";
    //     meta.grab.imageupload(Buffer.from(meta.imgbuff),fieldname,originalfile);

    // }
    // fr.readAsArrayBuffer(this.selectedFile)
    // }

  // handleReaderLoaded(e){
  //   this.base64textString = 'data:image/png;base64,'+btoa(e.target.result);
  //   console.log(this.base64textString);
  //   this.myphotoenc = this.base64textString.toString();
    
  // }

dismiss_minimumbid_error(){
  let meta = this;
  meta.minimumbid_error = false;
}

dismiss_baseprice_error(){
  let meta = this;
  meta.baseprice_error = 0;
}

dismiss_reset_time_error(){
  let meta = this;
  meta.reset_time_error = false;
}

dismiss_bid_increment_error(){
  let meta = this;
  meta.bid_increment_error = false;
}

dismiss_checktimeerror(){
  let meta = this;
  meta.checktimeerror = false;
}

async get_buffer():Promise<any>{
  let meta = this;
  return await new Promise((resolve,reject)=>{
    resolve()
  }) as Promise<any>;
}

upload(productname,start,end,base_price,bid_increment,minimum_bid,reset_time,reg_start,reg_end,minimum_bidders){
  let ins=this;
  // console.log(ins.myphotoenc,"fieldname","originalfile");
  // ins.grab.imageupload(ins.myphotoenc,"fieldname","originalfile");
  // ins.grab.upload(ins.myphotoenc,"productname","description specs");
  // return;
  // this.grab.pushFileToStorage(this.currentFileUpload);
  // return;
  //  this.get_buffer().then((res)=>{console.log(res)});  
   ins.auctionnotify = 0;
  ins.successful_message=false;
  ins.show_revert_error=false;
  ins.show_valid=false;
  ins.baseprice_error=0;
  ins.reset_time_error=false;
  ins.minimumbid_error=false;
  ins.bid_increment_error=false;
  ins.checktimeerror = false;

  var description=(document.getElementById("productdescription")as HTMLInputElement).value;


  if(productname.trim() !="" && reg_start.trim() !="" &&reg_end.trim()!="" && start.trim() !="" && end.trim() !="" && base_price.trim() !="" && bid_increment.trim() !="" && minimum_bid.trim() !="" && reset_time.trim() !="" && minimum_bidders.trim()!="" && description.trim()!="") 
  {
    if(Number(minimum_bid)<Number(bid_increment))
    {
      
      ins.minimumbid_error=true;
      // alert("minimum bid must be greater or equal to bid increment")
      return;
    }
    if(Number(base_price)<Number(minimum_bid)+(Number(bid_increment)-(Number(minimum_bid)%Number(bid_increment))))
    {
      ins.baseprice_error=Number(minimum_bid)+Number(bid_increment-(minimum_bid%bid_increment))
      // alert("Base price must be atleast"+f+"")
      return;
    }
    if(Number(reset_time)<=0)
    {
      ins.reset_time_error=true;
      // alert("Reset time must be greater than 0");
      return;
    }
    if(Number(bid_increment<=0))
    {
      ins.bid_increment_error=true;
      return;
    }

    if(!(reg_start.trim() < reg_end.trim() && reg_end.trim() < start.trim() && start.trim() < end.trim())){
      ins.checktimeerror = true;
      return;
    }
      // 
      // var headers = new HttpHeaders();
      // let fd = new FormData(); 
      // headers.append('Content-Type', 'application/form-data');
      // fd.append('path', ins.selectedFile);
      // console.log("gonna store in ipfs")
      // this.http.post("https://ipfs.infura.io:5001/api/v0/add?stream-channels=true",fd).subscribe((r)=>{
      var t=new Date(start).getTime() / 1000;
      var a:any = Math.round(t);
      var _starttime:number = parseInt(a);
      var t1=new Date(end).getTime() / 1000;
      var a1:any = Math.round(t1);
      var _endtime:number = parseInt(a1);
      var t3=new Date(reg_start).getTime()/1000;
      var c:any=Math.round(t3);
      var _reg_start:number=parseInt(c);
      var t4=new Date(reg_end).getTime()/1000;
      var d:any=Math.round(t4);
      var _reg_end:number=parseInt(d);

      ins.app.spinner.show();
      ins.grab.createAuction(_starttime,_endtime,base_price,bid_increment,minimum_bid,reset_time,_reg_start,_reg_end,minimum_bidders).then(res=>{
        
        if(res==1){  
          // this.grab.pushFileToStorage(this.currentFileUpload);
          ins.grab.pushFileToStorage(this.currentFileUpload).then(newimagename => {
            ins.grab.upload(newimagename,productname,description.trim()).then(isUploaded => {
              ins.app.spinner.hide();
              if(isUploaded){
                // ins.myphotoenc = undefined;
                ins.table_data();
                // ins.grab.upload("QmW8FNha22kC3YC35xAExnupaqHq5M2bGoTaNiZpemmxkv",productname);
                ins.successful_message=true;
                ins.auctionnotify = 1;
                document.documentElement.scrollTop = 0;
                (document.getElementById("productname")as HTMLInputElement).value="";
                (document.getElementById("regstarttime")as HTMLInputElement).value="";
                (document.getElementById("regendtime")as HTMLInputElement).value="";
                (document.getElementById("starttime")as HTMLInputElement).value="";
                (document.getElementById("endtime")as HTMLInputElement).value="";
                (document.getElementById("baseprice")as HTMLInputElement).value="";
                (document.getElementById("bidincrement")as HTMLInputElement).value="";
                (document.getElementById("minimumbid")as HTMLInputElement).value="";
                (document.getElementById("resettime")as HTMLInputElement).value="";
                (document.getElementById("minimumbidders")as HTMLInputElement).value="";
                (document.getElementById("fileInput")as HTMLInputElement).value="";        
                (document.getElementById("productdescription")as HTMLInputElement).value="";
                return;
              }
            });
          });
          

        }
        else if(res==2){
          // ins.myphotoenc = undefined;
          console.log('Error...');
          ins.show_valid=true;
          ins.auctionnotify = 3;
        }
        else{
          // ins.myphotoenc = undefined;
          ins.auctionnotify = 3;
          ins.show_valid=true;
        }
      })
    //  })  
  }
  else{    
    ins.auctionnotify = 2;
  }
}


table_data(){
  let instance = this;
  instance.grab.getauctiondetails().then(ress => {  
    instance.selected_aid.length = 0;
    ress[0].forEach(auction_id=> {
      let aid = auction_id+1;
        this.grab.canClone(aid).then(clonable=>{         
        if(clonable==true )
        {
          this.grab.auctionDetails(aid).then(auctionfinalize=>{
          if(auctionfinalize["status"]==1){
          this.grab.getAuctionById(aid).subscribe(res=>{
              let obj = {};
              obj['auctionId'] = aid;
              obj['productname'] =res['productname'];
              instance.selected_aid.push(obj);
            });
          }
        })
          }
        });
       });
     });     
  }

reset_form(){
  console.log("gonna reset")
  this.fieldClear(0);
  if(this.title=='Clone'){
    this.edit_as_create()
  }
  
}
edit_as_create(){
  this.title='Create';
  this.btnname=false;
  this.imgagefield=true;
  this.fieldClear(1);
   } 

edit_as_clone(){
  this.title='Clone';
  this.btnname=true;
  this.imgagefield=false;
  } 
setdetails(a_id){
  this.edit_as_clone();
  (document.getElementById("productname")as HTMLInputElement).value="";
  (document.getElementById("regstarttime")as HTMLInputElement).value="";
  (document.getElementById("regendtime")as HTMLInputElement).value="";
  (document.getElementById("starttime")as HTMLInputElement).value="";
  (document.getElementById("endtime")as HTMLInputElement).value="";
  (document.getElementById("baseprice")as HTMLInputElement).value="";
  (document.getElementById("bidincrement")as HTMLInputElement).value="";
  (document.getElementById("minimumbid")as HTMLInputElement).value="";
  (document.getElementById("resettime")as HTMLInputElement).value="";
  (document.getElementById("minimumbidders")as HTMLInputElement).value="";
  // if(){
  //   (document.getElementById("fileInput")as HTMLInputElement).value="";
  // }
  this.grab.auctionDetails(a_id).then(result=>{
    this.grab.getAuctionById(a_id).subscribe(res=>{
      this.selected_hash =res['ipfshash'];
      this.description = res['description'];
      this.productid=a_id;
      
      
      (document.getElementById("productname")as HTMLInputElement).value=res['productname'];
      (document.getElementById("baseprice")as HTMLInputElement).value=result.basePrice;
      (document.getElementById("bidincrement")as HTMLInputElement).value=result.bidIncrement;
      (document.getElementById("minimumbid")as HTMLInputElement).value=result.bidBounds[0];
      (document.getElementById("resettime")as HTMLInputElement).value=result.resetTime;
      (document.getElementById("minimumbidders")as HTMLInputElement).value=result.bidBounds[1];
      (document.getElementById("productname")as HTMLInputElement).readOnly=true;
      (document.getElementById("baseprice")as HTMLInputElement).readOnly=true;
      (document.getElementById("bidincrement")as HTMLInputElement).readOnly=true;
      (document.getElementById("minimumbid")as HTMLInputElement).readOnly=true;
      (document.getElementById("resettime")as HTMLInputElement).readOnly=true;
      (document.getElementById("minimumbidders")as HTMLInputElement).readOnly=true;
      // (document.getElementById("clonebidbtn")as HTMLDivElement).style.display="block";
      // (document.getElementById("newbidbtn")as HTMLDivElement).style.display="none";
      // (document.getElementById("fileInputbox")as HTMLInputElement).style.display="none";
      });
    });
  }

clone(productname,starttime,endtime,rgstarttime,rgendtime){
    let instance=this;
    instance.auctionnotify = 0;
    instance.successful_message=false;
    instance.show_revert_error=false;
    instance.show_valid=false;
    instance.checktimeerror = false;
    // var description=(document.getElementById("productdescription")as HTMLInputElement).value;
  if(productname.trim()!='' && starttime.trim()!='' && endtime.trim()!='' && rgstarttime.trim()!='' && rgendtime.trim()!='')
  {
    if(!(rgstarttime.trim() < rgendtime.trim() && rgendtime.trim() < starttime.trim() && starttime.trim() < endtime.trim())){
      instance.checktimeerror = true;
      return;
    }
    // instance.owner.spinner.show();
    var t=new Date(starttime).getTime() / 1000;
    var a:any = Math.round(t);
    var _starttime:number = parseInt(a);
    var t1=new Date(endtime).getTime() / 1000;
    var a1:any = Math.round(t1);
    var _endtime:number = parseInt(a1);
    var t3=new Date(rgstarttime).getTime()/1000;
    var c:any=Math.round(t3);
    var _reg_start:number=parseInt(c);
    var t4=new Date(rgendtime).getTime()/1000;
    var d:any=Math.round(t4);
    var _reg_end:number=parseInt(d);
    instance.app.spinner.show();
    instance.grab.cloneAuction(instance.productid,_starttime,_endtime,_reg_start,_reg_end).then(res=>{
      
      if(res==1){  
        instance.grab.upload(instance.selected_hash,productname,instance.description).then(isUploaded => {
          instance.successful_message=true;
          instance.auctionnotify = 1;
          document.documentElement.scrollTop = 0;
          instance.table_data();
          instance.app.spinner.hide();
          if(isUploaded){
            (document.getElementById("productname")as HTMLInputElement).value="";
            (document.getElementById("starttime")as HTMLInputElement).value="";
            (document.getElementById("endtime")as HTMLInputElement).value="";
            (document.getElementById("baseprice")as HTMLInputElement).value="";
            (document.getElementById("bidincrement")as HTMLInputElement).value="";
            (document.getElementById("minimumbid")as HTMLInputElement).value="";
            (document.getElementById("resettime")as HTMLInputElement).value="";
            (document.getElementById("regstarttime")as HTMLInputElement).value="";
            (document.getElementById("regendtime")as HTMLInputElement).value="";
            (document.getElementById("minimumbidders")as HTMLInputElement).value="";
            (document.getElementById("productname")as HTMLInputElement).readOnly=false;
          (document.getElementById("baseprice")as HTMLInputElement).readOnly=false;
          (document.getElementById("bidincrement")as HTMLInputElement).readOnly=false;
          (document.getElementById("minimumbid")as HTMLInputElement).readOnly=false;
          (document.getElementById("resettime")as HTMLInputElement).readOnly=false;
          (document.getElementById("minimumbidders")as HTMLInputElement).readOnly=false;
          this.edit_as_create();
        return;
          }
        });
        
      }
      else if(res==2){
        console.log('Error...');
        instance.show_revert_error=true;
        instance.auctionnotify = 3;
        // this.show_valid=true;
      }
      else{
        instance.show_revert_error=true;
        instance.auctionnotify = 3;
        // this.show_valid=true;
      }
    })
  }
  else{
    // alert("Invalid details");
    this.edit_as_create()
    instance.show_valid=true;
    instance.auctionnotify = 2;
  }
    
}
alertClose(){
  let instance = this;
  instance.auctionnotify = 0;
}
fieldClear(num){    
  (document.getElementById("productname")as HTMLInputElement).value="";
  (document.getElementById("regstarttime")as HTMLInputElement).value="";
  (document.getElementById("regendtime")as HTMLInputElement).value="";
  (document.getElementById("starttime")as HTMLInputElement).value="";
  (document.getElementById("endtime")as HTMLInputElement).value="";
  (document.getElementById("baseprice")as HTMLInputElement).value="";
  (document.getElementById("bidincrement")as HTMLInputElement).value="";
  (document.getElementById("minimumbid")as HTMLInputElement).value="";
  (document.getElementById("resettime")as HTMLInputElement).value="";
  (document.getElementById("minimumbidders")as HTMLInputElement).value="";
  // (document.getElementById("fileInput")as HTMLInputElement).value="";        
  if(num==1){
      (document.getElementById("productname")as HTMLInputElement).readOnly=false;
      (document.getElementById("baseprice")as HTMLInputElement).readOnly=false;
      (document.getElementById("bidincrement")as HTMLInputElement).readOnly=false;
      (document.getElementById("minimumbid")as HTMLInputElement).readOnly=false;
      (document.getElementById("resettime")as HTMLInputElement).readOnly=false;
      (document.getElementById("minimumbidders")as HTMLInputElement).readOnly=false;
  }  
}


ngOnInit() 
{  
// (document.getElementById("clonebidbtn")as HTMLDivElement).style.display="none";
this.table_data();                                                                                                                                                                                                                                                                                                                                                                  
}
}