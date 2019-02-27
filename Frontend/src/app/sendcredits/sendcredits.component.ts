import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sendcredits',
  templateUrl: './sendcredits.component.html',
  styleUrls: ['./sendcredits.component.css']
})
export class SendcreditsComponent implements OnInit {
  public validation_error:boolean;
  public credittransferrnotify:number=0;
  public unable_to_perform:boolean;
  public revert_error:boolean;
  
   constructor(private grabit:GrabitService, private app:AppComponent) {
    }
  
   sendcredits(receiver,credit){
     let meta=this;
     meta.credittransferrnotify=0;
     if(receiver.trim() !="" && credit.trim() !=""){
     meta.app.spinner.show();
     meta.grabit.mint(receiver,credit).then(res=>{
      meta.app.spinner.hide();
       if(res == 1) {
         (document.getElementById("raddress")as HTMLInputElement).value="";
         (document.getElementById("creditsid")as HTMLInputElement).value="";
         meta.credittransferrnotify=1;
        }
       else if(res == 0) {
        meta.credittransferrnotify=3;
  
       }
       else if(res == 2) {
        meta.credittransferrnotify=3;
      }
     })
   }
   else{
    meta.credittransferrnotify=2;
  }
   }
   alertClose(){
    let meta=this;
    meta.credittransferrnotify=0;
   }
  
   ngOnInit() {
   }
  
  }
