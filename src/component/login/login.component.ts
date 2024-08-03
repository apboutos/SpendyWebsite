import {Component, OnDestroy, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Environment} from "../../environment";
import {UserAuthenticationResponse} from "../../model/authenitcation-response";

@Component({
  selector: 'login-component',
  templateUrl: 'login-component.html',
  styleUrl: 'login-component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  private AUTHENTICATE_USER_URL =`${Environment.SPENDY_API_PRODUCTION_URL}/api/v1/users/authenticate`;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit(): void {

  }

  onSubmit(loginForm: NgForm): void {

    const body = {
      "username": loginForm.value.username,
      "password": loginForm.value.password
    };

    let headers = new HttpHeaders()
    headers.set("Access-Control-Allow-Origin","*");

    this.httpClient.post<UserAuthenticationResponse>(this.AUTHENTICATE_USER_URL, body, {headers}).subscribe({
      next: response => {
        localStorage.setItem('token',response.token);
        localStorage.setItem('username',loginForm.value.username);
        this.router.navigateByUrl('/ledger').then(r => {});
      },
      error: response => {
        console.log(response.error);
        alert(response.error.message);
      }
    });
  }

  ngOnDestroy(): void {

  }

}
