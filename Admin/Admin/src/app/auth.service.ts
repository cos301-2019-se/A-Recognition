import { Injectable } from '@angular/core';
import { AngularFireAuth } from  '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-ts';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: any;
  email: string;
  title: any;  
  displayMessage: string;
  message: boolean = true;
  tokenBook = {};

  constructor( public  authAf: AngularFireAuth, public router: Router,public http: HttpClient)
  {

  }
  
  public generateToken()
  {
    this.http.post("http://localhost:3000/generateToken",{
      sender: this.email
    },{responseType: 'text'}).subscribe(data=>
    {
      this.user$ = data;
      localStorage.setItem('token', data);
      //console.log(data);
    });
  }

  public getTitle()
  {
    this.http.post("http://localhost:3000/getTitle",{
      email:this.email
    }).subscribe(data=>
    {
      this.title = data;
    });
  }

  // Functionality for logging in
  async login(email: string,pass: string)
  {
    try
    {
      this.email = email;
      await this.authAf.auth.signInWithEmailAndPassword(email,pass).then(value =>
        {
          console.log('SUCCESS', value);
          this.getTitle();
          this.generateToken();
          setTimeout(()=>
          {
            this.router.navigate(['home']);
          }, 2000);
          
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
  public getSecret()
  {
    if(this.tokenBook[this.email] == undefined)
    {
      return null;
    }
    let count = this.tokenBook[this.email];
    let s = "";

    for (let index = 0; index < count; index++) 
    {
        s += this.title;
    }
    const hash = crypto.SHA256(s);
    const shortHash = hash[0] + hash[7] + hash[23] + hash[39] + hash[46] + hash[55];
    return shortHash;
  }
  // Check whether there exists a token
  public isAuthenticated() : boolean
  {
    let token = localStorage.getItem('token');
    console.log("Token: ",token);
    if(token )
    {
      return true;
    }
    return false;
  }

  public logout()
  {
    console.log("Removing Token");
    localStorage.removeItem('token');
  }
}
