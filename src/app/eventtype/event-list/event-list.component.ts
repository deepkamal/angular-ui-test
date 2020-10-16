import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition, EventType, Market } from '@app/_models/events';
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
    this.betappService.listCompetitionsByEventType(this.id).subscribe(x => {
      this.competitions = x;
      x.forEach(element => {
        this.alldata={};
        this.betappService.listEventsByCompetitionId(this.id,element.competition.id).subscribe(y => {
        // betappService.listEventsByCompetitionId(id, aCompetition.competition.id)
          this.alldata['comp']=element;
          this.alldata['event']=y;
          //betappService.listMarketsForEvent(item.event.id)
          y.forEach(element1 => {
            this.betappService.listMarketsForEvent(element1.event.id).subscribe(z => {
              this.alldata['market']=z;
            })
          });
          
          this.data.push(this.alldata);
      });
    });
      console.log(`Competitions GOT :::: `, this.data);
    });
    
  }

  enableMarket(eventType: EventType, aCompetition: Competition, anEvent: Event, aMarket: Market, selected: boolean): any {
    return this.betappService.enableMarket(eventType, aCompetition, anEvent, aMarket, selected);
  }

  saveMarkets(): any {
    return this.betappService.saveMarkets().then(resp=>{
      console.log("RESPONSE",resp);
    })
  }

  clearMarkets(): any {
    return console.log(this.betappService.clearMarkets());
  }

}
