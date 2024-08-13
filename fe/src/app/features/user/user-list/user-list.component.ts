import { RouteStateService } from './../../../core/services/route-state.service';
import { User } from './../user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Role as UserRolesList } from 'src/app/core/enums/role.enum';
import { SearchUser } from 'src/app/core/models/search/search-user.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthorizationHelper } from '../../../core/helpers/authorization.helper';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  currentUserRole: string;
  columns: any[];
  users: User[];
  pageSize = 20;
  pageNumber = 0;
  totalRecords: number;
  loading: boolean;

  booleanOptions = [
    {
      id: null,
      name: 'Ativo',
    },
    {
      id: true,
      name: 'Sim',
    },
    {
      id: false,
      name: 'Não',
    },
  ];
  userRoles = [];
  rolesList = UserRolesList;
  searchUser = new SearchUser();
  pageSizes = [
    {
      label: '20',
      value: 20,
    },
    {
      label: '50',
      value: 50,
    },
    {
      label: '100',
      value: 100,
    },
  ];

  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private routeStateService: RouteStateService,
    private toastService: ToastService,
    public authorizationHelper: AuthorizationHelper
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.columns = [
      { field: 'username', header: 'Username' },
      { field: 'role', header: 'Role' },
      { field: 'ip', header: 'IP' },
      { field: 'lastLogin', header: 'Último Login' },
    ];

    this.userRoles.push({
      id: null,
      name: 'Role',
    });
    for (const role in UserRolesList) {
      if (
        UserRolesList.hasOwnProperty(role) &&
        isNaN(parseInt(role, 10)) &&
        UserRolesList[role] !== UserRolesList.ALL
      ) {
        this.userRoles.push({
          id: role,
          name: this.translateService.instant(
            'USER.ROLE.' + (UserRolesList[role] as string).toUpperCase(),
            true
          ),
        });
      }
    }

    this.searchFormChanged();
  }

  goToUserDetail(user: User) {
    this.routeStateService.add(
      'User Detail',
      '/backoffice/utilizador/detalhe/' + user._id,
      user,
      false
    );
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message:
        'Esta ação é irreversível, tem a certeza que quer eliminar este utilizador?',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe(_ => {
          this.toastService.addSingle(
            'success',
            '',
            'Utilizador eliminado com sucesso'
          );
          this.searchFormChanged();
        });
      },
      reject: () => {
        console.log('Abortar eliminar utilizador');
      },
    });
  }

  pageSizeChanged() {
    this.searchFormChanged();
  }

  searchFormChanged(event?: any) {
    this.searchUser.pageNumber = event ? event.first / this.pageSize : 0;
    this.searchUser.pageSize = this.pageSize;

    this.userService.getUsers(this.searchUser).subscribe(users => {
      this.pageSize = users.pageSize;
      this.pageNumber = users.pageNumber;
      this.users = users.data;
      this.totalRecords = users.numberOfRecords;
      this.loading = false;
    });
  }
}
