import { LiveEventsComponent } from './live-events/live-events.component';
import { EventListComponent } from './event-list/event-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
// import { AddEditComponent } from './add-edit.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: ListComponent },
      { path: 'list/:id', component: ListComponent },
      { path: 'eventlist/:id', component: EventListComponent },
      { path: 'liveevents', component: LiveEventsComponent }
      // { path: 'edit/:id', component: AddEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventTypesRoutingModule { }
