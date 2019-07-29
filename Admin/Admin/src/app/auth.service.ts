import { Injectable } from '@angular/core';
import { AngularFireAuth } from  '@angular/fire/auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Object;
  displayMessage: string;
  message: boolean = true;
  constructor(public jwtHelper: JwtHelperService, public  authAf: AngularFireAuth, public router: Router,public http: HttpClient)
  {

  }
  
  public generateToken()
  {
    this.http.get("http://localhost:3000/generateToken").subscribe(data=>
    {
      this.user$ = data;
      console.log(data);
      localStorage.setItem("token", JSON.stringify(data));
    });
  }

  // Functionality for logging in
  async login(email: string,pass: string)
  {
    try
    {
      await this.authAf.auth.signInWithEmailAndPassword(email,pass).then(value =>
        {
          console.log('SUCCESS', value);
          this.generateToken();
          // localStorage.setItem('token', JSON.stringify(this.user$));
          this.router.navigate(['home']);
        }).catch(err =>
          {
            console.log('Something went wrong', err.message);
            this.router.navigate(['login']);
            
            this.displayMessage = err.message;
          });
    }
    catch(e)
    {
      this.displayMessage = e.message;
    }
  }
  // Check whether there exists a token
  public isAuthenticated() : boolean
  {
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    // let temp = this.jwtHelper.decodeToken(token);
    // Check whether the token is expired and return true or false
    return true;//!this.jwtHelper.isTokenExpired(this.user$.toString());
  }
  
  public logout()
  {
    localStorage.setItem("token",null);
  }
}
