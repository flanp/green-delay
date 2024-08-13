import { buildQueryString } from 'src/app/core/helpers/query-string.helper';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerBaseService } from 'src/app/core/services/server-base.service';
import { User } from './user.model';
import { SearchUser } from 'src/app/core/models/search/search-user.model';
import { PaginatedResponse } from 'src/app/core/models/search/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'user';

  private currentUser: User;

  constructor(private serverBaseService: ServerBaseService) {}

  getUsers(searchUser: SearchUser): Observable<PaginatedResponse<User>> {
    const obj = Object.assign({}, searchUser);
    obj.role = obj.role ? (obj.role as any).id : undefined;
    obj.isActive = obj.isActive ? (obj.isActive as any).id : undefined;
    const query = buildQueryString(obj);

    return this.serverBaseService.get<PaginatedResponse<User>>(
      this.userUrl + '?' + query
    );
  }

  addUser(user: User): Observable<number> {
    return this.serverBaseService.post<number>(
      this.userUrl + '/register',
      user
    );
  }

  editUser(user: User): Observable<void> {
    return this.serverBaseService.put<void>(this.userUrl, user);
  }

  deleteUser(userId: number): Observable<number> {
    return this.serverBaseService.delete<number>(this.userUrl + `/${userId}`);
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
