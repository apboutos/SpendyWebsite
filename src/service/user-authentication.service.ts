import {Environment} from "../environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserAuthenticationResponse} from "../model/authenitcation-response";

export class UserAuthenticationService {

  private AUTHENTICATE_USER_URL =`${Environment.SPENDY_API_PRODUCTION_URL}/api/v1/users/authenticate`;

  constructor(private http: HttpClient) {}

  public authenticate(username: string, password: string) {

    const body = {
      "username": username,
      "password": password
    };
    const headers = new HttpHeaders()
    headers.set("Access-Control-Allow-Origin","*");

    return this.http.post<UserAuthenticationResponse>(this.AUTHENTICATE_USER_URL, body, {headers})
  }
}
