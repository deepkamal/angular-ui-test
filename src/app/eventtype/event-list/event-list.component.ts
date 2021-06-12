import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Competition, Event, EventType, Market} from '../../_models/events';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SkyexchangeService } from '@app/_services/skyexchange.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.less']
})
export class EventListComponent implements OnInit {

  marketForm: FormGroup;
  competitions: Competition[];
  eventType: any;
  // eventType: EventType;
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
  eventTypeData: EventType;
  aCompetitionData: Competition;
  anEventData: Event;
  aMarketData: Market;
  selected: boolean;
  marketAdded:any;
  @ViewChild('closebutton') closebutton;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private skyService: SkyexchangeService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document) {
      this.marketForm = this.fb.group({
        min: ["", Validators.required],
        max: ["", Validators.required],
        sDate: ["", Validators.required],
        eDate: ["", Validators.required],
      });
  }

  ngOnInit(): any {

    this.id = this.route.snapshot.params.id;
    
    this.data=[];
    // this.eventType = this.skyService.getEventTypeById(this.id);
    this.skyService.getAllLiveMarkets().subscribe(markets => {
      this.liveMarkets=markets;
      this.skyService.getEventTypeById(this.id).subscribe((x:any) => {
        this.eventType=x
        this.eventType.events.forEach(element => {
          this.alldata={}
          
          if(element.id>0){
            var elementPos = this.data.map(function(x) {return x.id; }).indexOf(element.competitionId);
            
            if(elementPos<0){
              
              this.alldata['name']=element.competitionName;
              this.alldata['id']=element.competitionId;
              this.alldata['event']=new Array(element);
              this.data.push(this.alldata);
            }
            else{
              this.data[elementPos].event.push(element);
            }
            
           
          }
          
        });
        this.showLoad=false;
        console.log(this.data);
      });
    })

    
    
    // console.log(`GOT ID=${this.id}`);
    // this.skyService.getAllLiveMarkets().subscribe(markets => {
    //   //console.log(markets);
    //   this.liveMarkets=markets;
    // })
    // this.skyService.listCompetitionsByEventType(this.id).subscribe(x => {
    //   this.competitions = x;
    //   //this.data=x;
    //   //this.alldata={};
    //   x.forEach(element => {
    //     this.alldata={};
    //     this.alldata['comp']=element;
          
    //       this.data.push(this.alldata);
    //       this.showLoad=false;
    //   });
    // //});
    // });
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

  isMarketLive(marketId){
    console.log(marketId);
    var liveMarket = this.liveMarkets.map(function(x) {return x.marketId; }).indexOf(marketId);
    console.log(liveMarket);
    return liveMarket<0?false:true;
    
  }

  getevent(cid,i){
    if(this.data[i].event==undefined){
      this.showLoad=true;
    this.skyService.listEventsByCompetitionId(this.id,cid).subscribe(y => {
      y.sort((a, b) => {
        return <any>new Date(b.event.openDate) - <any>new Date(a.event.openDate);
      });
      this.data[i]['event']=y;
      this.showLoad=false;
    })
  }

  // console.log(this.data[i]['event']);
  }

  getmarket(eid,i,j){
    if(this.data[i].event[j].market==undefined){
      this.showLoad=true;
      
    this.skyService.listMarketsForEvent(eid).subscribe(z => {
      console.log(this.liveMarkets);
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

    this.skyService.getFencyBet(eid).subscribe(x => {
      this.data[i]['event'][j]['fency']=x.marketList;
    })

    this.skyService.getBookmakerMarket(eid).subscribe(y => {
      this.data[i]['event'][j]['book']=y;
    })

  }
    
  }

  toggleMarket(marketId,event,a){
    // console.log(event);
    if(event.target.checked){
      this.activateMarket(marketId);
    }
    else{
      this.suspendMarket(marketId);
    }
  }

  openLiveMarketModel(eventType: EventType, aCompetition: Competition, anEvent: Event, aMarket: Market, selected: boolean){
    this.eventTypeData=eventType;
    this.aCompetitionData=aCompetition;
    this.anEventData=anEvent;
    this.aMarketData=aMarket;
    this.selected=selected;
  }

  enableMarket(): any {
    this.anEventData['min']=this.marketForm.value.min;
    this.anEventData['max']=this.marketForm.value.max;
    this.anEventData['sDate']=new Date(this.marketForm.value.sDate).getTime();
    this.anEventData['eDate']=new Date(this.marketForm.value.eDate).getTime();
    //console.log(this.anEventData);
    this.closebutton.nativeElement.click();
    return this.skyService.enableMarket(this.eventTypeData, this.aCompetitionData, this.anEventData, this.aMarketData, this.selected);
  }

  activateMarket(marketId){
    return this.skyService.activateMarket(marketId);
  }

  suspendMarket(marketId){
    return this.skyService.suspendMarket(marketId);
  }

  saveMarkets(): any {
    this.showLoad=true;
    var alertmsg="Below market successfully added\n\n";
    return this.skyService.saveMarkets().then(resp=>{
       // console.log("RESPONSE",resp.add_result.result.markets_added);
      //console.log(resp.add_result.result.markets_added);
      if(resp.add_result.marketsToAdd!="nothing to add"){
        this.marketAdded=resp.add_result.result.markets_added;
        localStorage.setItem("Notifications",JSON.stringify(this.marketAdded));
      resp.add_result.result.markets_added.forEach(element => {
      this.skyService.runMarketApi(element).subscribe(z => {
      //this.showLoad=false;
      
      
      });
      alertmsg +=element.eventName+"---"+element.marketName+"\n";
      
      });
      var eid=this.id;
       alert(alertmsg);
      setTimeout(function(){ window.location.href="eventtype/eventlist/"+eid; }, 3000);
    }
    else{
      alert("Process completed");
    }
      
      //window.location.href="/eventtype/eventlist/"+this.id;
    })
  }

  clearMarkets(): any {
    return console.log(this.skyService.clearMarkets());
  }

}
