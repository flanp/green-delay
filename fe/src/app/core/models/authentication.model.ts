import { User } from './../../features/user/user.model';

export class Authentication {
  userWithoutHash: User;
  token: string;
  refreshToken: string;

  constructor() {
    this.userWithoutHash = null;
    this.token = null;
    this.refreshToken = null;
  }
}
