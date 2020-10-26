import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import {LayoutComponent} from './layout.component';
import {ListComponent} from './list.component';
import {EventTypesRoutingModule} from './eventTypes-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { LiveEventsComponent } from './live-events/live-events.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EventTypesRoutingModule
  ],
  declarations: [
    LayoutComponent,
    ListComponent,
    EventListComponent,
    LiveEventsComponent
  ]
})
export class EventTypesModule { }
