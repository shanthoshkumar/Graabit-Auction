import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GrabitService } from '../service/grabit.service';

@Injectable({
  providedIn: 'root'
})
export class MydealsGuard implements CanActivate {
  constructor(private grabit:GrabitService,private route:Router){
  }

  clear_pending_details(){
    let meta = this;
    let index = 0;
    meta.grabit.regPenAucId.forEach(auction_id => {
      index++;
      meta.grabit.regPenHash[auction_id] = undefined;
      if(index == meta.grabit.regPenAucId.length){
        meta.grabit.regPenAucId = [];
      }
    })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let meta = this;
      return new Promise((resolve,reject)=>{
        meta.grabit.getPrivateKey().then(credential => {
          if(credential['privateKey']!='' && credential['privateKey']!=undefined){
            if(credential['isowner']){
              resolve(false);
              meta.route.navigate(['home']);  
            }
            else{
              resolve(true);
            }
          }
          else{
            resolve(false);
            meta.route.navigate(['home']);
            if(credential['privateKey']==null ||credential['privateKey']=='' || credential['privateKey']==undefined){
              meta.grabit.isLoggedIncheck = false;
              meta.grabit.isadmin = false;
              meta.grabit._etherumAccountAddress=null;
              meta.grabit._privateKey=null;
              meta.grabit.deleteToken();
              meta.grabit.deleteSessionPrivateKey();
              meta.clear_pending_details();
            }
          }
        })
      });
  }
}
