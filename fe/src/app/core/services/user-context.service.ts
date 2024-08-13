import { User } from 'src/app/features/user/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from 'src/app/core/services/session.service';
import { Authentication } from '../models/authentication.model';

const defaultUser = null;

@Injectable({
  providedIn: 'root',
})
export class UserContextService {
  public user$ = new BehaviorSubject<User>(defaultUser);

  constructor(private sessionService: SessionService) {
    const data = this.sessionService.getItem('currentUser');
    if (data != null) {
      this.user$.next(data);
    }
  }

  public setAuthentication(authentication: Authentication) {
    this.sessionService.setItem('accessToken', authentication.token);
    this.sessionService.setItem('refreshToken', authentication.refreshToken);
    this.sessionService.setItem('role', authentication.userWithoutHash.role);
    this.sessionService.setItem('email', authentication.userWithoutHash.email);

    this.sessionService.setItem('currentUser', authentication.userWithoutHash);
    this.user$.next(authentication.userWithoutHash);
  }

  public logout() {
    this.sessionService.removeItem('accessToken');
    this.sessionService.removeItem('refreshToken');
    this.sessionService.removeItem('role');
    this.sessionService.removeItem('email');

    this.sessionService.removeItem('currentUser');

    // clear all information
    this.sessionService.clear();
    this.user$.next(defaultUser);
  }
}
