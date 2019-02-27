import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-changeowner',
  templateUrl: './changeowner.component.html',
  styleUrls: ['./changeowner.component.css']
})
export class ChangeownerComponent implements OnInit {
  
  public ownertransfernotify:number =0 ;
    constructor(private grabit:GrabitService,private route:Router,private app:AppComponent) { }
  
    transferOwnership(toaddress:string){
      let instance = this;
      instance.ownertransfernotify=0;
      if(toaddress.trim() !=""){
        instance.app.spinner.show();
        instance.grabit.transferOwnership(toaddress.trim()).then(res =>{
          instance.app.spinner.hide();
          if(res == 0){
            instance.ownertransfernotify=3;
          }
          else if(res == 1){
            document.documentElement.scrollTop = 0;
            (document.getElementById("toadd")as HTMLInputElement).value="";
            instance.ownertransfernotify=1;       
            instance.grabit.deleteToken();
            instance.grabit._privateKey='';
            instance.grabit._etherumAccountAddress='';
            instance.route.navigate(['/home']);
          }
          else if(res == 2){
            instance.ownertransfernotify=3;
          }
        })
      }
      else{
        instance.ownertransfernotify=2;
      }
    }

    alertClose(){
      let instance =this;
      instance.ownertransfernotify=0;      
    }
  
    ngOnInit() {
      (document.getElementById("addr")as HTMLInputElement).value=this.grabit._etherumAccountAddress;
    }
  
  }