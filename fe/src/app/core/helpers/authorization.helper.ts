import { Role } from '../enums/role.enum';
import { SessionService } from '../services/session.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationHelper {
  constructor(private sessionService: SessionService) {}

  isA() {
    const role = this.sessionService.getItem('role');
    return Role.A === Role[role];
  }

  isU() {
    const role = this.sessionService.getItem('role');
    return Role.U === Role[role];
  }

  isW() {
    const role = this.sessionService.getItem('role');
    return Role.W === Role[role];
  }
}
