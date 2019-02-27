import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GrabitService } from '../service/grabit.service';

@Injectable({
  providedIn: 'root'
})
export class SignupLoginGuard implements CanActivate {
  constructor(private grabit:GrabitService){

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
        meta.grabit.getPrivateKey().then(credential =>{
          if((credential['privateKey']==null || credential['privateKey'] == ''|| credential['privateKey'] == undefined)){
            meta.grabit.isLoggedIncheck = false;
            meta.grabit.isadmin = false;
            meta.grabit._etherumAccountAddress=null;
            meta.grabit._privateKey=null;
            meta.clear_pending_details();
            resolve(true);
          }
          else{
            resolve(false);
          }
        })
      });
  }
}
