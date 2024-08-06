import { SessionSubscriberComponent } from './session-subscriber/session-subscriber.component';
import { SessionPublisherComponent } from './session-publisher/session-publisher.component';
import { SessionRoutingModule } from './session-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app-common.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SessionRoutingModule,
    AppCommonModule,
    TranslateModule,
  ],
  declarations: [SessionPublisherComponent, SessionSubscriberComponent]
})
export class SessionModule { }
