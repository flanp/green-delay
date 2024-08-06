import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuDataService } from 'src/app/core/services/menu-data.service';
import { ApplicationStateService } from 'src/app/core/services/application-state.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  isMenuVisible: boolean;
  isPublicRoute: boolean;
  showBanner = false;

  constructor(
    private menuDataService: MenuDataService,
    private applicationStateService: ApplicationStateService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sessionService: SessionService
  ) {
    this.router.events.subscribe((event: Event) => {
      this.isPublicRoute =
        event instanceof NavigationEnd && event.url.includes('publico');
    });
  }

  ngOnInit() {
    this.menuDataService.toggleMenuBar.subscribe(data => {
      if (data && data != null) {
        this.isMenuVisible = !this.isMenuVisible;
      }
    });
    
    const dayOfMonth = new Date().getDate();
    if (dayOfMonth >= 1 && dayOfMonth <= 3) {
      this.showPaymentDialog();
    }

    this.isMenuVisible = !this.applicationStateService.getIsMobileResolution();
  }

  private showPaymentDialog() {
    const showedBanner = this.sessionService.getItem('showedBanner');
    if (showedBanner) {
      return;
    }

    this.sessionService.setItem('showedBanner', true);
    this.confirmationService.confirm({
      header: 'Aviso',
      message: 'Período de renovação ativo (pagamentos entre dia 1 a 3 de cada mês)',
      rejectVisible: false,
      acceptLabel: 'OK',
      accept: () => {
        this.confirmationService.close();
      }
  });
  }

  ngOnDestroy() {
    this.menuDataService.toggleMenuBar.observers.forEach(element =>
      element.complete()
    );
  }
}
