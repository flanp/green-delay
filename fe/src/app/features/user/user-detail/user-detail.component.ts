import { userRolesList } from './../../../core/enums/role.enum';
import { ToastService } from './../../../core/services/toast.service';
import { RouteStateService } from './../../../core/services/route-state.service';
import { User } from '../user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Role as UserRolesList } from 'src/app/core/enums/role.enum';
import { SearchUser } from 'src/app/core/models/search/search-user.model';
import { TranslateService } from '@ngx-translate/core';
import {AuthorizationHelper} from '../../../core/helpers/authorization.helper';
import {ConfirmationService} from 'primeng/api';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user: User;
  userRoles   = userRolesList;

  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private routeStateService: RouteStateService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    public authorizationHelper: AuthorizationHelper,
  ) {}

  ngOnInit() {
    this.user = this.routeStateService.getCurrent().data;
    this.buildForm();
  }

  editUser() {
    this.user.name = this.userForm.controls.name.value;
    this.user.email = this.userForm.controls.email.value;
    this.user.group = this.userForm.controls.group.value;
    this.user.username = this.userForm.controls.username.value;
    this.user.role = this.userForm.controls.role.value.value;
    this.user.renewalDate = this.userForm.controls.renewalDate.value;
    this.user.isActive = this.userForm.controls.isActive.value;

    this.userService.editUser(this.user).subscribe(_ => {
      this.toastService.addSingle('success', '', 'Utilizador editado com sucesso');
      this.routeStateService.updateCurrentData(this.user);
    });
  }

  deleteUser() {
    this.confirmationService.confirm({
      message: 'Esta ação é irreversível, tem a certeza que quer eliminar este utilizador?',
      accept: () => {
        this.userService.deleteUser(this.user.id);
      },
      reject: () => {
        console.log('Abortar eliminar utilizador');
        },
    });
  }

  private buildForm() {
    this.userForm = this.formBuilder.group({
      name: [this.user ? this.user.name : '', Validators.required],
      email: [this.user ? this.user.email : '', Validators.required],
      group: [this.user ? this.user.group : '', Validators.required],
      username: [this.user ? this.user.username : '', Validators.required],
      role: [this.user ? this.userRoles.find(x => x.value === this.user.role) : '', Validators.required],
      renewalDate: [this.user ? new Date(this.user.renewalDate) : '', Validators.required],
      lastLogin: new FormControl({value: this.user ? formatDate(this.user.lastLogin, 'dd-MM-yyyy HH:mm', 'en') : '', disabled: true }),
      isActive: [this.user ? this.user.isActive : false, Validators.required]
    });
  }
}
