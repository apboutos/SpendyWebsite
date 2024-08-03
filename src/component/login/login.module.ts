import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { LoginComponent } from './login.component';
import {FormsModule} from "@angular/forms";
import {UserAuthenticationService} from "../../service/user-authentication.service";
import {HttpClient, HttpHandler} from "@angular/common/http";



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage
  ],
  exports: [LoginComponent],
  providers: []
})
export class LoginModule { }

