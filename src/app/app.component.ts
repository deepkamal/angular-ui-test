import {Component} from '@angular/core';

import {AccountService, BetappService} from './_services';
import {User} from './_models';
import {Competition, EventType} from './_models/events';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({selector: 'app', templateUrl: 'app.component.html'})
export class AppComponent {
  user: User;
  eventTypes: EventType[];

  constructor(private accountService: AccountService, private betService: BetappService) {
    this.accountService.user.subscribe(x => this.user = x);
    this.betService.listEventType().subscribe(x => this.eventTypes = x);
    // else {
    //   this.eventTypes = trc;
    //   //   (new Observable<EventType []>()).pipe(map((x: EventType[]) => {
    //   //   return trc;
    //   // }));
    // }
  }

  listCompetitionsOfType(typeId): Competition[] {
    return this.betService.listCompetitionsByEventType(typeId);
  }

  logout(): any {
    this.accountService.logout();
  }
}
