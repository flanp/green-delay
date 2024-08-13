import { StreamRegistrationComponent } from './stream-registration/stream-registration.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/enums/role.enum';

const routes: Routes = [
  {
    path: 'listagem',
    component: StreamListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ALL] },
  },
  {
    path: 'registar',
    component: StreamRegistrationComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.A, Role.W] },
  },
  {
    path: '',
    redirectTo: 'listagem',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StreamRoutingModule {}
