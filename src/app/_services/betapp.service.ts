import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {Odd, Runner, MarketOdd, Market, Event, Competition, EventType} from '../_models/events';

@Injectable({providedIn: 'root'})
export class BetappService {
  private EVENT_API: 'http://cricflame.co.in/developer/';
  private eventTypes: Observable<EventType[]>;
  private eventTypeSubject: BehaviorSubject<EventType[]>;
  private events: Observable<Event[]>;
  private eventSubject: BehaviorSubject<Event[]>;
  private markets: Observable<Market[]>;
  private marketSubject: BehaviorSubject<Market[]>;
  private competitions: Observable<Competition[]>;
  private competitionSubject: BehaviorSubject<Competition[]>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.eventTypeSubject = new BehaviorSubject<EventType[]>(JSON.parse(localStorage.getItem('eventTypes')));
    this.eventTypes = this.eventTypeSubject.asObservable();

    this.eventSubject = new BehaviorSubject<Event[]>(JSON.parse(localStorage.getItem('events')));
    this.events = this.eventSubject.asObservable();

    this.marketSubject = new BehaviorSubject<Market[]>(JSON.parse(localStorage.getItem('markets')));
    this.markets = this.marketSubject.asObservable();

    this.competitionSubject = new BehaviorSubject<Competition[]>(JSON.parse(localStorage.getItem('competitions')));
    this.competitions = this.competitionSubject.asObservable();

    this.loadLiveMarkets();
  }

  loadLiveMarkets(): void {
    // Load Live market - call the API eventMarkets

    let listEMs = [];

    const url = 'https://j8e31fqi63.execute-api.ap-south-1.amazonaws.com/test/getLiveMarkets';

    console.log(`URL is ${url} ${typeof this.http}`)
    this.http.get(url).pipe(map((liveMarkets: any) => {
      console.log('BOOM',liveMarkets);
    }));
    console.log(`CALLLEDDDDDDDDDDD  URL is ${url} ${typeof this.http}`)

  }

  listEventType(): Observable<EventType[]> {
    // const url = this.EVENT_API + 'listEventTypes';
    const url = 'http://cricflame.co.in/developer/listEventTypes';
    const localData = localStorage.getItem('eventTypes');
    if (localData) {
      this.eventTypeSubject.next(JSON.parse(localData) as EventType[]);
      // return data from local storage, `of` used to create Observable on the fly
      return of(JSON.parse(localData) as EventType[]);
    }
    return this.http.get(url).pipe(map((x: EventType[]) => {
      // console.log('got this', x);
      const eventTypeData = {};
      x.map((eventType) => {
        eventTypeData[eventType.eventType.id] = eventType;
      });
      localStorage.setItem('eventTypes', JSON.stringify(x));
      // console.log('setting event Type data', eventTypeData);
      localStorage.setItem('eventTypeMap', JSON.stringify(eventTypeData));
      this.eventTypeSubject.next(x);
      return x;
    }));
  }

  getEventTypeById(id): EventType {
    // console.log('the event type is ', JSON.parse(localStorage.getItem('eventTypeMap'))[id]);
    return (localStorage.getItem('eventTypeMap') != null ? JSON.parse(localStorage.getItem('eventTypeMap'))[id] : {}) as EventType;
  }

  listEventsByType(typeId): any {
  }

  listCompetitionsByEventType(typeId): any {
    const url = 'http://cricflame.co.in/developer/listCompetitions/' + typeId;
    const competitions = localStorage.getItem(`COMPETITIONS_${typeId}`) != null ?
      JSON.parse(localStorage.getItem(`COMPETITIONS_${typeId}`)) : null;
    if (competitions == null) {
      return this.http.get(url).pipe(map(comps => {
        localStorage.setItem(`COMPETITIONS_${typeId}`, JSON.stringify(comps));

        return comps;
      }));
    } else {
      return of(competitions) as Observable<Competition[]>;
    }

  }

  listEventsByCompetitionId(eventTypeId, comId): Observable<Event[]> {
    const url = `http://cricflame.co.in/developer/listEvents/${eventTypeId}/${comId}`;

    // find if the competition ID is in localStorage or not
    const compEvents = localStorage.getItem(`COMP_EVENTS_${comId}`) != null ?
      JSON.parse(localStorage.getItem(`COMP_EVENTS_${comId}`)) : null;

    if (compEvents == null) {
      // find events from HTTP Call
      return this.http.get(url).pipe(map((events: Event[]) => {
        console.log(`got events`, events);
        localStorage.setItem(`COMP_EVENTS_${comId}`, JSON.stringify(events));
        return events;
      }));
    } else {
      return of(compEvents) as Observable<Event[]>;
    }

  }

  listMarketsForEvent(eventId): Observable<Market[]> {
    const url = `http://cricflame.co.in/developer/listMarketTypes/${eventId}`;

    // find if the competition ID is in localStorage or not
    const eventMarkets = localStorage.getItem(`MARKETS_${eventId}`) != null ?
      JSON.parse(localStorage.getItem(`MARKETS_${eventId}`)) : null;

    if (eventMarkets == null) {
      // find events from HTTP Call
      return this.http.get(url).pipe(map((events: Market[]) => {
        localStorage.setItem(`MARKETS_${eventId}`, JSON.stringify(events));
        return events;
      }));
    } else {
      return of(eventMarkets) as Observable<Market[]>;
    }
  }

  enableMarket(eventType: EventType, aCompetition: Competition, anEvent: Event, aMarket: Market): any {

    this.loadLiveMarkets();

    let eventMarketObj = anEvent;

    eventMarketObj['competition'] = aCompetition;
    eventMarketObj['eventType'] = eventType;
    eventMarketObj['market'] = aMarket;

    console.log(eventMarketObj);

  }

  disableMarket(marketId): any {
  }

  enableEvent(eventId): any {
  }

  disableEvent(eventId): any {
  }

  enableCompetition(compId): any {
  }

  disableCompetition(compId): any {
    console.log('disableCompetition called');
  }

  suspendCompetition(compId): any {
    console.log('suspendCompetition called');

  }

  enableEventType(eventTypeId): any {
  }

  disableEventType(eventTypeId): any {
  }


}
