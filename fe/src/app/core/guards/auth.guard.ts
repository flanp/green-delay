import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { SessionService } from '../services/session.service';
import { Role } from '../enums/role.enum';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private sessionService: SessionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUserRole = this.sessionService.getItem('role');
    if (currentUserRole) {
      // check if route is restricted by role
      if (
        route.data.roles &&
        !route.data.roles.includes(Role.ALL) &&
        !route.data.roles.includes(Role[currentUserRole])
      ) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
