import { RouteStateService } from './../../../core/services/route-state.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AuthorizationHelper } from 'src/app/core/helpers/authorization.helper';
import { userRolesList } from 'src/app/core/enums/role.enum';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit {
  userForm: FormGroup;
  user: User = new User();
  userRoles = userRolesList;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastService: ToastService,
    private routeStateService: RouteStateService,
    public authorizationHelper: AuthorizationHelper
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: [this.user.email, [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
      ]],
      selectedUserRole: [this.userRoles[0], Validators.required],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  confirmUserChanges(form: FormGroup) {
    this.user.email = this.userForm.controls.email.value;
    this.user.role = this.userForm.controls.selectedUserRole.value.value;
    this.user.name = this.userForm.controls.name.value;
    this.user.username = this.userForm.controls.username.value;
    this.user.password = this.userForm.controls.password.value;

    this.userService
      .addUser(this.user)
      .subscribe(_ => {
        this.toastService.addSingle('success', '', 'Utilizador criado com sucesso');
        this.routeStateService.add(
          'User',
          '/backoffice/utilizador',
          null,
          true
        );
      });
  }
}
