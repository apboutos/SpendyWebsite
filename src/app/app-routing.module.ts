import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "../component/login/login.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
/*  {
    path: 'ledger',
    component: LedgerComponent
  },*/
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component:LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
