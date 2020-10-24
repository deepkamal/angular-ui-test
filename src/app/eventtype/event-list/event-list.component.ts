import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Competition, Event, EventType, Market} from '../../_models/events';
import { BetappService } from '@app/_services';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private betappService: BetappService) {
  }

  ngOnInit(): any {

    this.id = this.route.snapshot.params.id;
    
    this.data=[];
    this.eventType = this.betappService.getEventTypeById(this.id);
    // console.log(`GOT ID=${this.id}`);
    this.betappService.getAllLiveMarkets().subscribe(markets => {
      console.log(markets);
      this.liveMarkets=markets;
    })
    this.betappService.listCompetitionsByEventType(this.id).subscribe(x => {
      this.competitions = x;
      //this.data=x;
      //this.alldata={};
      x.forEach(element => {
        this.alldata={};
        this.alldata['comp']=element;
        // this.betappService.listEventsByCompetitionId(this.id,element.competition.id).subscribe(y => {
        // // betappService.listEventsByCompetitionId(id, aCompetition.competition.id)
        //   this.alldata['comp']=element;
        //   this.alldata['event']=y;
        //   //betappService.listMarketsForEvent(item.event.id)
        //   y.forEach(element1 => {
        //     this.betappService.listMarketsForEvent(element1.event.id).subscribe(z => {
        //       this.alldata['market']=z;
        //     })
        //   });
          
          this.data.push(this.alldata);
      });
    //});
      console.log(`Competitions GOT :::: `, this.data);
    });
    
  }

  getevent(cid,i){
    if(this.data[i].event==undefined){
    this.betappService.listEventsByCompetitionId(this.id,cid).subscribe(y => {
      y.sort((a, b) => {
        return <any>new Date(b.event.openDate) - <any>new Date(a.event.openDate);
      });
      this.data[i]['event']=y;
    })
  }
  console.log(this.data[i]['event']);
  }

  getmarket(eid,i,j){
    if(this.data[i].event[j].market==undefined){
    this.betappService.listMarketsForEvent(eid).subscribe(z => {
      z.forEach(element => {
        var index=this.liveMarkets.findIndex(x => x.marketId === element.marketId);
        if(index<0){
          element['live']=false;
        }
        else{
        element['live']=true;
        }
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
    return this.betappService.saveMarkets().then(resp=>{
      console.log("RESPONSE",resp);
      //console.log(resp.add_result.result.markets_added);
      resp.add_result.result.markets_added.forEach(element => {
      this.betappService.runMarketApi(element);
      alert("Process completed");
      });
    })
  }

  clearMarkets(): any {
    return console.log(this.betappService.clearMarkets());
  }

}
