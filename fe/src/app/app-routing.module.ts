import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './features/login/login.component';
import { FullScreenComponent } from './shared/full-screen/full-screen.component';
import { HomepageComponent } from './features/homepage/homepage.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'backoffice',
    component: LayoutComponent,
    children: [
      {
        path: 'inicio',
        component: HomepageComponent,
      },
      {
        path: 'utilizador',
        loadChildren: () =>
          import('src/app/features/user/user.module').then(m => m.UserModule),
      },
      {
        path: 'stream',
        loadChildren: () =>
          import('src/app/features/stream/stream.module').then(
            m => m.StreamModule
          ),
      },
    ],
  },
  {
    path: 'full-screen',
    component: FullScreenComponent,
    children: [
      {
        path: 'sessao',
        loadChildren: () =>
          import('src/app/features/session/session.module').then(
            m => m.SessionModule
          ),
      },
    ],
  },
  // {
  //   path: 'error',
  //   component: ErrorComponent,
  //   //loadChildren: () => import('src/app/shared/error/error.module').then(m => m.ErrorModule)
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
