import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { LoginComponent } from './login.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage
  ],
  exports: [LoginComponent]
})
export class LoginModule { }

