import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: User;

  constructor(public jwtHelper: JwtHelperService, public  authAf: AngularFireAuth)
  {
    this.authAf.authState.subscribe(user => {
      if (user) 
      {
      //   this.user$ = user;
      //   const jwtBearerToken = jwtHelper.sign({}, RSA_PRIVATE_KEY, {
      //     algorithm: 'RS256',
      //     expiresIn: 120,
      //     subject: this.user$
      // }
        localStorage.setItem('token', JSON.stringify(this.user$));
      }
      else
      {
        localStorage.setItem('token', null);
      }
    });
  }

  //Check whether there exists a token
  public isAuthenticated() : boolean
  {
    const token = localStorage.getItem('token');

    //Check whether the token is expired and return true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
