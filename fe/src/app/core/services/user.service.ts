import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerBaseService } from './server-base.service';
import { Authentication } from '../models/authentication.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'user';
  constructor(private serverBaseService: ServerBaseService) {}

  login(username: string, password: string): Observable<Authentication> {
    return this.serverBaseService.getAuthToken<Authentication>(username, password);
  }

  saveIp(ip: string): Observable<void> {
    return this.serverBaseService.put<void>(this.url + '/ip', { ip });
  }

  changePassword(oldPassword: string, newPassword: string, newPasswordConfirmation: string): Observable<void> {
    return this.serverBaseService.put<void>(this.url + '/change-password', { oldPassword, newPassword, newPasswordConfirmation });
  }

  isActive(): Observable<any> {
    return this.serverBaseService.get<any>(this.url + '/active');
  }
}
