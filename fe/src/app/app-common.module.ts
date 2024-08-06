import { HasRoleDirective } from './core/directives/has-role.directive';
import { NgModule } from '@angular/core';
import { NgPrimeModule } from 'src/app/app-ngprime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisableControlDirective } from './core/directives/disable-control.directive';

@NgModule({
  declarations: [DisableControlDirective, HasRoleDirective],
  imports: [],
  exports: [
    NgPrimeModule,
    FormsModule,
    ReactiveFormsModule,
    DisableControlDirective,
    HasRoleDirective
  ],
})
export class AppCommonModule {}
