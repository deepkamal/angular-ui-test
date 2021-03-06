import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

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

  private live_markets: any;
  private _markets_to_add: any;
  private _markets_to_remove: any;
  private _markets_to_activate:any;
  private _markets_to_suspend:any;

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
    this._markets_to_add = [];
    this._markets_to_remove = [];
    this._markets_to_activate=[];
    this._markets_to_suspend=[];


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

  getFencyBet(eventId): Observable<any> {
    return this.http.get<any>("https://hb8w2ob1u4.execute-api.ap-south-1.amazonaws.com/v2/fancyMarkets?eventId="+eventId);
  }
  getBookmakerMarket(eventId): Observable<any> {
    return this.http.get<any>("https://hb8w2ob1u4.execute-api.ap-south-1.amazonaws.com/v2/bookMakerMarkets?eventId="+eventId);
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

  getRunnerListByMarket(marketId): Observable<any> {
    const url = `http://cricflame.co.in/developer/listMarketRunner/${marketId}`;
    return this.http.get<any>(url);
    
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
      "min_bet": anEvent.min,
      "max_bet": anEvent.max,
      "market_live_after": anEvent.sDate,
      "enabled": true,
      "status":'active'
    };
    console.log(eventMarketObj);
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
          this._markets_to_add.push(eventMarketObj);
        }
        delete this._markets_to_remove[key];
      } else {
        if (this.live_markets[key] !== undefined) {
          console.log('Adding to DISABLE list');
          this._markets_to_remove[key] = eventMarketObj;
        }
        delete this._markets_to_add[key];
      }

       console.log(this._markets_to_add);
    });

  }

  declareMarket(Details): Observable<any> {
    
    return this.http
      .post("https://hb8w2ob1u4.execute-api.ap-south-1.amazonaws.com/v2/declareMarket",Details,
      {headers: {"x-icloudex-iss": "OrgAdmin"}})
      .pipe(catchError(this.handleError));
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

  activateMarket(marketId){
    this._markets_to_activate.push(marketId);
  }

  suspendMarket(marketId){
    this._markets_to_suspend.push(marketId);
    console.log(this._markets_to_suspend);
  }

  saveMarkets(): any {
    console.log("going to save markets", this.markets_to_remove, this.markets_to_add);
    var marketArray={};
    marketArray['marketsToAdd']=this.markets_to_add;
    marketArray['marketsToSuspend']=this._markets_to_suspend;
    marketArray['marketsToActivate']=this._markets_to_activate;
    console.log(marketArray)
    this.markets_to_add=[];
    this._markets_to_suspend=[];
    this._markets_to_activate=[];
    return this.http.post(
      "https://hb8w2ob1u4.execute-api.ap-south-1.amazonaws.com/v2/eventMarkets",
      marketArray,
      {headers: {"x-icloudex-iss": "OrgAdmin"}}).pipe().toPromise();
  }

  runMarketApi(element): Observable<any> {
      return this.http.get<any>("http://cricflame.co.in/addMarketShaktiApi/"+element.marketId);
    
    
  }

  clearMarkets(): boolean {
    this.markets_to_add = [];
    return (this.markets_to_add.length === 0);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

       // alert(error.error.message);

    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }

}
