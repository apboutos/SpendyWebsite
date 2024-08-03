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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginModule
  ],
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
