import { SessionSubscriberComponent } from './session-subscriber/session-subscriber.component';
import { SessionPublisherComponent } from './session-publisher/session-publisher.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/enums/role.enum';

const routes: Routes = [
  {
    path: 'produtor/:name',
    component: SessionPublisherComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.A, Role.W] },
  },
  {
    path: 'consumidor/:name',
    component: SessionSubscriberComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ALL] },
  },
  {
    path: '',
    redirectTo: 'produtor',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionRoutingModule {}
