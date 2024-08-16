import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from './core/services/session.service';
import { Router, Event, NavigationEnd, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { url } from 'inspector';
import { TawkService } from './core/services/tawk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Rapid Stream';
  showLoader: boolean;
  isStreamWindow: boolean;

  constructor(
    private loaderService: LoaderService,
    private translateService: TranslateService,
    private router: Router,
    private tawkService: TawkService

  ) {
    this.tawkService.setChatVisibility(false);
    translateService.setDefaultLang('pt');
    this.router.events.pipe(filter((event: Event) => event instanceof NavigationEnd)).subscribe((event: RouterEvent) => {
      this.isStreamWindow = event.url.includes('/full-screen/sessao/produtor') || event.url.includes('/full-screen/sessao/consumidor');
      if (event.url == '/' || event.url.includes('/login') || event.url.includes('/full-screen')) {
        console.log('not showing chat');
        this.tawkService.setChatVisibility(false);
      } else {
        console.log('showing chat');
        this.tawkService.load();
        this.tawkService.setChatVisibility(true);
      }
    });
  }

  ngOnInit() {
    this.loaderService.status.subscribe(
      (val: boolean) => (this.showLoader = val)
    );
  }

  ngOnDestroy() {
    this.loaderService.status.observers.forEach(element => element.complete());
  }
}
