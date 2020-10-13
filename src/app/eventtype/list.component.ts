import {Component, OnInit} from '@angular/core';

import {BetappService} from '@app/_services';
import {Competition, Event, EventType, Market} from '../_models/events';
import {ActivatedRoute, Router} from '@angular/router';

@Component({templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {

  competitions: Competition[];
  eventType: EventType;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private betappService: BetappService) {
  }

  ngOnInit(): any {

    this.id = this.route.snapshot.params.id;

    this.eventType = this.betappService.getEventTypeById(this.id);
    // console.log(`GOT ID=${this.id}`);
    this.betappService.listCompetitionsByEventType(this.id).subscribe(x => {
      this.competitions = x;
      console.log(`Competitions GOT :::: `, this.competitions);
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

}
