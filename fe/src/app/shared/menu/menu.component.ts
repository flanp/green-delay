import { BehaviorSubject } from 'rxjs';
import { UserContextService } from 'src/app/core/services/user-context.service';
import { AuthorizationHelper } from 'src/app/core/helpers/authorization.helper';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomMenuItem } from 'src/app/core/models/custom-menu-item.model';
import { SessionService } from 'src/app/core/services/session.service';
import { MenuDataService } from 'src/app/core/services/menu-data.service';
import { ApplicationStateService } from 'src/app/core/services/application-state.service';
import { RouteStateService } from 'src/app/core/services/route-state.service';
import { User } from 'src/app/features/user/user.model';
import { DialogService } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  items: CustomMenuItem[];
  selectedItem: string;
  visible: boolean;
  showChangePassword: boolean;
  nextRenewalDefault: Date;

  user$: BehaviorSubject<User>;

  constructor(
    private routeStateService: RouteStateService,
    private sessionService: SessionService,
    private menuDataService: MenuDataService,
    private applicationStateService: ApplicationStateService,
    private userContextService: UserContextService,
    private dialogService: DialogService,
    public authorizationHelper: AuthorizationHelper
  ) {}

  ngOnInit() {
    this.items = this.menuDataService.getMenuList();

    this.menuDataService.toggleMenuBar.subscribe(data => {
      if (data) {
        this.visible = !this.visible;
      }
    });

    this.visible = !this.applicationStateService.getIsMobileResolution();
    const activeMenu = this.sessionService.getItem('active-menu');
    this.selectedItem = activeMenu ? activeMenu : 'Utilizadores';

    this.user$ = this.userContextService.user$;

    let now = new Date();
    this.nextRenewalDefault = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      3
    );
  }

  /**
   * Click event when a menu item is clicked
   */
  onMenuClick(menu: CustomMenuItem) {
    // if child are available then open child
    if (menu.childs !== undefined && menu.childs != null) {
      return;
    }

    this.selectedItem = menu.routerLink;
    this.sessionService.setItem('active-menu', menu.routerLink);
    this.routeStateService.add(menu.label, menu.routerLink, null, true);

    // hide menu bar after menu click for mobile layout
    if (this.applicationStateService.getIsMobileResolution()) {
      setTimeout(() => {
        this.visible = false;
      }, 100);
    }
  }

  changePassword() {
    this.showChangePassword = true;
    const ref = this.dialogService.open(ChangePasswordComponent, {
      header: 'Alterar palavra-passe',
    });
  }

  ngOnDestroy() {
    this.menuDataService.toggleMenuBar.observers.forEach(element => {
      element.complete();
    });
  }
}
