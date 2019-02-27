import { Component,Input,OnInit,OnDestroy} from '@angular/core';
import { GrabitService } from '../service/grabit.service';
// declare let $:any;
@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.css']
})
export class ClosedComponent implements OnInit,OnDestroy {

  block={};
 @Input() start
//  @Input() end;

 constructor(
    // private el: ElementRef,
    private grab:GrabitService

  ) {

  }

 
    ngOnInit() {
        let instance=this;
        let data=instance.start;
        instance.block={};
        let obj={};
       obj['hash']=data['ipfsimghash'];
       obj['productname'] = data['productname'];
       obj['required']=data['required'];
       obj['registered']=data['registered'];
       obj['minBid']=data['minBid'];
       obj['ismeetrequired']=data['ismeetrequired'];
       obj['winner']=data['winner'];
       obj['aucid']=data.auction_id;
       if(instance.grab.closedauctionid == data.auction_id){
        instance.grab.triggerclosed = true;
       }
       instance.grab.lastBidderDetails(data.auction_id).then(winner=>{
        if(winner=='No Bid Logs Found'){
            obj['winner']='No One';
            instance.block=obj;
        }
        else{
            instance.grab.getUserName(winner.returnValues['0']).subscribe(name=>{
                if(data.result[6] != 1){
                    obj['winner']="Soon announced";
                    instance.block=obj;
                } 
                else{
                    obj['winner']=name['fullName']
                    instance.block=obj;
                }
            });
        }
    })
  }
  ngOnDestroy(){
      let instance = this;
    instance.block = undefined; 
  }

}
