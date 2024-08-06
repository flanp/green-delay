import { Pagination } from './pagination.model';

export class SearchUser extends Pagination {
  id: number;
  email: string;
  username: string;
  role: any | string;
  ip: string;
  name: string;
  isActive: any | boolean;
  isRegistered: string;
  lastLogin: Date;

  constructor() {
    super();
    this.id = undefined;
    this.email = undefined;
    this.username = undefined;
    this.role = undefined;
    this.ip = undefined;
    this.name = undefined;
    this.isActive = undefined;
    this.isRegistered = undefined;
    this.lastLogin = undefined;
  }
}
