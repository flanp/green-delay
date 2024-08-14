import { Base } from 'src/app/core/models/base.model';

export class User extends Base {
  id: number;
  refreshToken: string;
  lastLogin: Date;
  email: string;
  username: string;
  group: string;
  role: string;
  name: string;
  password: string;
  renewalDate: Date;
  ips: { ip: string, count: number, lastLogin: Date }[];
  isActive: boolean;

  constructor(id?: number, name?: string) {
    super();
    this.id = id;
    this.refreshToken = null;
    this.lastLogin = null;
    this.email = null;
    this.username = null;
    this.group = null;
    this.role = null;
    this.name = name;
    this.password = null;
    this.renewalDate = null;
    this.ips = [];
    this.isActive = false;
  }
}
