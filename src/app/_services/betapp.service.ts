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

  private live_markets: {};
  private _markets_to_add: any;
  private _markets_to_remove: any;

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

    this.live_markets = {};
    this._markets_to_add = {};
    this._markets_to_remove = {};

    this.loadLiveMarkets();
  }


  get markets_to_add(): any {
    return this._markets_to_add;
  }

  set markets_to_add(value: any) {
    this._markets_to_add = value;
  }

  get markets_to_remove(): any {
    return this._markets_to_remove;
  }

  set markets_to_remove(value: any) {
    this._markets_to_remove = value;
  }

  loadLiveMarkets(): void {
    // Load Live market - call the API eventMarkets
    const url = 'https://j8e31fqi63.execute-api.ap-south-1.amazonaws.com/test/getLiveMarkets';

    this.http.get(url).pipe().toPromise().then(data => {
      if (Array.isArray(data)) {
        data.map((market) => {
          this.live_markets[market.eventId + "_" + market.marketId] = market;
        })
      }
    });

  }

  getAllLiveMarkets(): Observable<any> {
    const url = 'https://j8e31fqi63.execute-api.ap-south-1.amazonaws.com/test/getLiveMarkets';
    return this.http.get<any>(url);

    // return this.http.get<any>(this.apiUrl + "menus/"+menuType);
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

  listMarketRunners(marketId): Observable<Runner[]> {
    const url = `http://cricflame.co.in/developer/listMarketRunner/${marketId}`;

    // find if the Runners are  in localStorage or not
    const marketRunners = localStorage.getItem(`RUNNERS_${marketId}`) != null ?
      JSON.parse(localStorage.getItem(`RUNNERS_${marketId}`)) : null;

    if (marketRunners == null) {
      // find events from HTTP Call
      return this.http.get(url).pipe(map((runners: Runner[]) => {
        localStorage.setItem(`RUNNERS_${marketId}`, JSON.stringify(runners));
        return runners;
      }));
    } else {
      return of(marketRunners) as Observable<Runner[]>;
    }
  }

  enableMarket(eventType: EventType, aCompetition: Competition, anEvent: Event, aMarket: Market, selected: boolean): any {
    let eventMarketObj = {
      eventId: anEvent.event.id,
      eventName: anEvent.event.name,
      eventOpenDate: anEvent.event.openDate,
      eventMarketCount: anEvent.marketCount,
      competitionName: aCompetition.competition.name,
      competitionId: aCompetition.competition.id,
      competitionMarketCount: aCompetition.marketCount,
      competitionRegion: aCompetition.competitionRegion,
      eventTypeId: eventType.eventType.id,
      eventTypeName: eventType.eventType.name,
      marketId: aMarket.marketId,
      marketName: aMarket.marketName,
      marketMatched: aMarket.totalMatched,
      "min_bet": 300,
      "max_bet": 3000
    };

    let key = eventMarketObj['eventId'] + "_" + eventMarketObj['marketId'];
    console.log(`Received Key ${key} for value ${selected}`)

    return this.listMarketRunners(aMarket.marketId).subscribe(data => {
      console.log(`got data ${data}`, data)
      eventMarketObj['selections'] = data[0]['runners']

      let selectionObj = {}

      eventMarketObj['selections'].map((sel, index) => {
        selectionObj[sel.selectionId] = sel;
      })

      eventMarketObj['selectionsObj'] = selectionObj;
      if (selected) {
        if (this.live_markets[key] === undefined) {
          console.log('Adding to enable list');
          this._markets_to_add[key] = eventMarketObj;
        }
        delete this._markets_to_remove[key];
      } else {
        if (this.live_markets[key] !== undefined) {
          console.log('Adding to DISABLE list');
          this._markets_to_remove[key] = eventMarketObj;
        }
        delete this._markets_to_add[key];
      }

      // console.log(this._markets_to_remove, this._markets_to_add);
    });

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

  saveMarkets(): any {
    console.log("going to save markets", this.markets_to_remove, this.markets_to_add);
    return this.http.post(
      "https://kxkn0cd8ti.execute-api.ap-south-1.amazonaws.com/v1/eventMarkets",
      Object.values(this.markets_to_add),
      {headers: {"x-icloudex-iss": "OrgAdmin"}}).pipe().toPromise();
  }

  clearMarkets(): boolean {
    this.markets_to_add = [];
    return (this.markets_to_add.length === 0);
  }

}
