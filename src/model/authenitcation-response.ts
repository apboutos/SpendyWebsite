export class UserAuthenticationResponse {

  constructor(public httpStatus: string,
              public result: string,
              public message: string,
              public timestamp: Date,
              public token: string) {
  }
}
