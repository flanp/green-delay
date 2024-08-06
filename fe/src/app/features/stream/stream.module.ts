import { UserStreamListComponent } from './user-stream-list/user-stream-list.component';
import { AdminStreamListComponent } from './admin-stream-list/admin-stream-list.component';
import { StreamRoutingModule } from './stream-routing.module';
import { StreamRegistrationComponent } from './stream-registration/stream-registration.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app-common.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    StreamRoutingModule,
    AppCommonModule,
    TranslateModule,
  ],
  declarations: [StreamListComponent, StreamRegistrationComponent, AdminStreamListComponent, UserStreamListComponent]
})
export class StreamModule { }
