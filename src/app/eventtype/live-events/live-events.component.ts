import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BetappService } from '@app/_services';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.less']
})
export class LiveEventsComponent implements OnInit {
  liveMarkets: any;
  showLoad: boolean;
  id: string;
  searchTerm:any="";

  //showName:boolean;

  // clickVisible(){
  //   this.showName = !this.showName;
  // }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private betappService: BetappService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
  ) { }

  ngOnInit(): void {
    this.betappService.getAllLiveMarkets().subscribe(markets => {
      //  console.log(markets);
      this.liveMarkets=markets;
    })
    
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

  toggleMarket(marketId,event,a){
    // alert(a);
    if(event.target.checked){
      this.activateMarket(marketId);
    }
    else{
      this.suspendMarket(marketId);
    }
  }

  activateMarket(marketId){
    return this.betappService.activateMarket(marketId);
  }

  suspendMarket(marketId){
    return this.betappService.suspendMarket(marketId);
  }

  saveMarkets(): any {
    this.showLoad=true;
    return this.betappService.saveMarkets().then(resp=>{
      //  console.log("RESPONSE",resp);
      //console.log(resp.add_result.result.markets_added);
      if(resp.add_result.marketsToAdd!="nothing to add"){
      resp.add_result.result.markets_added.forEach(element => {
      this.betappService.runMarketApi(element);
      this.showLoad=false;

      alert("Process completed");
      window.location.href="/eventtype/liveevents";
      });
    }
    else{
      alert("Process completed");
      window.location.href="/eventtype/liveevents";
    }
    })
  }

  clearMarkets(): any {
    return console.log(this.betappService.clearMarkets());
  }  
}
