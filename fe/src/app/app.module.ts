import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Prime NG
import { MessageService, ConfirmationService } from 'primeng/api';
// App related
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { MenuComponent } from './shared/menu/menu.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppCommonModule } from 'src/app/app-common.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './features/login/login.component';
import { ServerBaseService } from './core/services/server-base.service';
import { FullScreenComponent } from './shared/full-screen/full-screen.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';
import { DialogService } from 'primeng/dynamicdialog';
import { HomepageComponent } from './features/homepage/homepage.component';
import { AudioSourcePickerComponent } from './shared/audio-source-picker/audio-source-picker.component';
import { StatsInputModalComponent } from './shared/stats-input-modal/stats-input-modal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    LayoutComponent,
    LoginComponent,
    FullScreenComponent,
    ChangePasswordComponent,
    HomepageComponent,
    AudioSourcePickerComponent,
    StatsInputModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AppCommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [TranslateModule],
  providers: [
    MessageService,
    ServerBaseService,
    ConfirmationService,
    DialogService,
  ],
  entryComponents: [
    ChangePasswordComponent,
    AudioSourcePickerComponent,
    StatsInputModalComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
