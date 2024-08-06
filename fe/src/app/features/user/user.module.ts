import { UserDetailComponent } from './user-detail/user-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppCommonModule } from 'src/app/app-common.module';
import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    AppCommonModule,
    TranslateModule,
  ],
  providers: [DatePipe],
  declarations: [UserListComponent, UserRegistrationComponent, UserDetailComponent]
})
export class UserModule { }
