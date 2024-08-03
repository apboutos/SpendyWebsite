import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserAuthenticationService} from "../../service/user-authentication.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'login-component',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {



  constructor(private router: Router, private userAuthenticationService: UserAuthenticationService) {
  }

  ngOnInit(): void {

  }

  onSubmit(loginForm: NgForm): void {

    this.userAuthenticationService.authenticate(loginForm.value.username, loginForm.value.password).subscribe({
      next: response => {
        sessionStorage.setItem('token',response.token);
        sessionStorage.setItem('username',loginForm.value.username);
        alert("Logged in successfully");
        //this.router.navigateByUrl('/login').then(r => {});
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
