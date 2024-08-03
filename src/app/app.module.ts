import {NgModule, provideZoneChangeDetection} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule, routes} from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {LoginModule} from "../component/login/login.module";
import {provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {LedgerComponent} from "../component/ledger/ledger-component";
import {LedgerModule} from "../component/ledger/ledger-module";
import {DateAdapter, MAT_DATE_FORMATS} from "@angular/material/core";
import {CUSTOM_DATE_FORMATS, CustomDateAdapter} from "../util/custom-date-adapter";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginModule,
    LedgerModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOM_DATE_FORMATS,
    },
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
