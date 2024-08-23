import { IpService } from 'src/app/core/services/ip.service';
import { Component } from '@angular/core';
import { RouteStateService } from 'src/app/core/services/route-state.service';
import { UserContextService } from 'src/app/core/services/user-context.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { TawkService } from 'src/app/core/services/tawk.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string;
  password: string;

  isBusy: boolean;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private routeStateService: RouteStateService,
    private userContextService: UserContextService,
    private ipService: IpService,
    private tawkService: TawkService
  ) {
    this.tawkService.load();
    this.tawkService.setChatVisibility(true);
  }

  onClickLogin() {
    this.isBusy = true;
    this.userService
      .login(this.username, this.password)
      .subscribe(authenticationModel => {
        this.isBusy = false;
        if (authenticationModel) {
          this.userContextService.setAuthentication(authenticationModel);
          this.routeStateService.add(
            'Stream',
            '/backoffice/stream',
            null,
            true
          );

          this.ipService
            .getIp()
            .subscribe(res => this.userService.saveIp(res.ip).subscribe());
          this.tawkService.updateTawkUser(authenticationModel.userWithoutHash.username);
          return;
        }

        this.toastService.addSingle('error', '', 'Username ou password inválidos');
      });
  }
}
