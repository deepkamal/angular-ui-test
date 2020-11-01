import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Competition, Event, EventType, Market} from '../../_models/events';
import { BetappService } from '@app/_services';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.less']
})
export class EventListComponent implements OnInit {

  competitions: Competition[];
  eventType: EventType;
  id: number;
  alldata: any;
  data: any[];
  liveMarkets:any;
  showLoad:boolean=true;
  activeButDisabed:boolean=false;
  suspendButDisabed:boolean=false;
  searchTerm:any;
  MinBetAmount:any;
  MaxBetAmount:any;
  ScheduledLiveTime:any;
  ScheduledCloseTime:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private betappService: BetappService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document) {
  }

  ngOnInit(): any {

    this.id = this.route.snapshot.params.id;
    
    this.data=[];
    this.eventType = this.betappService.getEventTypeById(this.id);
    // console.log(`GOT ID=${this.id}`);
    this.betappService.getAllLiveMarkets().subscribe(markets => {
      //console.log(markets);
      this.liveMarkets=markets;
    })
    this.betappService.listCompetitionsByEventType(this.id).subscribe(x => {
      this.competitions = x;
      //this.data=x;
      //this.alldata={};
      x.forEach(element => {
        this.alldata={};
        this.alldata['comp']=element;
          
          this.data.push(this.alldata);
          this.showLoad=false;
      });
    //});
    });
    let script = this._renderer2.createElement("script");
    script.type = `text/javascript`;
    script.text = `
    $(document).ready(function(){
          $(document).on('click','.marketactionbtn',function() {
            $(this).attr('disabled',true);
        });
        });
`;
    this._renderer2.appendChild(this._document.body, script);
  }

  getevent(cid,i){
    if(this.data[i].event==undefined){
      this.showLoad=true;
    this.betappService.listEventsByCompetitionId(this.id,cid).subscribe(y => {
      y.sort((a, b) => {
        return <any>new Date(b.event.openDate) - <any>new Date(a.event.openDate);
      });
      this.data[i]['event']=y;
      this.showLoad=false;
    })
  }
  console.log(this.data[i]['event']);
  }

  getmarket(eid,i,j){
    if(this.data[i].event[j].market==undefined){
      this.showLoad=true;
      
    this.betappService.listMarketsForEvent(eid).subscribe(z => {
      z.forEach(element => {
        var index=this.liveMarkets.findIndex(x => x.marketId === element.marketId);
        if(index<0){
          element['live']=false;
          element['active']=false;
        }
        else{
        element['live']=true;
        element['active']= element['active']=this.liveMarkets[index].enabled;;
        }
        this.showLoad=false;
      });
      
      this.data[i]['event'][j]['market']=z;
      console.log(z);
    })
  }
    
  }

  enableMarket(eventType: EventType, aCompetition: Competition, anEvent: Event, aMarket: Market, selected: boolean): any {
    return this.betappService.enableMarket(eventType, aCompetition, anEvent, aMarket, selected);
  }

  activateMarket(marketId){
    return this.betappService.activateMarket(marketId);
  }

  suspendMarket(marketId){
    return this.betappService.suspendMarket(marketId);
  }

  saveMarkets(): any {
    this.showLoad=true;
    var alertmsg="Below market successfully added\n\n";
    return this.betappService.saveMarkets().then(resp=>{
      //  console.log("RESPONSE",resp.add_result.result.markets_added);
      //console.log(resp.add_result.result.markets_added);
      if(resp.add_result.marketsToAdd!="nothing to add"){
      resp.add_result.result.markets_added.forEach(element => {
      this.betappService.runMarketApi(element);
      this.showLoad=false;
      
      alertmsg +=element.eventName+"---"+element.marketName+"\n";
      
      //window.location.href="/eventtype/eventlist/"+this.id;
      });
      alert(alertmsg);
    }
    else{
      alert("Process completed");
    }
      
      window.location.href="/eventtype/eventlist/"+this.id;
    })
  }

  clearMarkets(): any {
    return console.log(this.betappService.clearMarkets());
  }

}
