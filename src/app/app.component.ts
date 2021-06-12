import { SkyexchangeService } from './_services/skyexchange.service';
import {Component} from '@angular/core';

import {AccountService} from './_services';
import {User} from './_models';
import {Competition, EventType} from './_models/events';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({selector: 'app', templateUrl: 'app.component.html'})
export class AppComponent {
  user: User;
  eventTypes: any;
  Notifications:any;
  eventCount:any=[];

  constructor(private accountService: AccountService, private skyService: SkyexchangeService) {
    this.accountService.user.subscribe(x => this.user = x);
    this.skyService.listEventType().subscribe((x:any) => {
      this.eventTypes = JSON.parse(x.result);
    });
    this.skyService.getLiveEventCount().subscribe((x:any) => {
      //this.eventTypes = x;
      x.onLiveEvents.forEach(element => {
        this.eventCount[element.eventType]=element.count;
      });
    });
    
    // else {
    //   this.eventTypes = trc;
    //   //   (new Observable<EventType []>()).pipe(map((x: EventType[]) => {
    //   //   return trc;
    //   // }));
    // }
    this.Notifications=JSON.parse(localStorage.getItem('Notifications'));
    console.log(this.Notifications);
  }

  clearLocalStorage(){
    localStorage.clear();
  }

  listCompetitionsOfType(typeId): Competition[] {
    return this.skyService.listCompetitionsByEventType(typeId);
  }

  logout(): any {
    this.accountService.logout();
  }
}
