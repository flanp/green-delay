import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteStateService } from 'src/app/core/services/route-state.service';
import { SessionService } from 'src/app/core/services/session.service';
import { MenuDataService } from 'src/app/core/services/menu-data.service';
import { UserContextService } from 'src/app/core/services/user-context.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isOpened = true;

  constructor(
    private router: Router,
    private routeStateService: RouteStateService,
    private sessionService: SessionService,
    private userContextService: UserContextService,
    private menuDataService: MenuDataService
  ) {}

  ngOnInit() { }

  logout() {
    this.routeStateService.removeAll();
    this.userContextService.logout();
    this.sessionService.removeItem('active-menu');
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isOpened = !this.isOpened;
    this.menuDataService.toggleMenuBar.next(true);
  }
}
