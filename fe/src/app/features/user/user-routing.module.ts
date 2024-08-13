import { UserDetailComponent } from './user-detail/user-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserRegistrationComponent } from '../user/user-registration/user-registration.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {Role} from '../../core/enums/role.enum';

const routes: Routes = [
  {
    path: 'listagem',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.A] },
  },
  {
    path: 'registar',
    component: UserRegistrationComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.A] },
  },
  {
    path: 'detalhe/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.A] },
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
export class UserRoutingModule {}
