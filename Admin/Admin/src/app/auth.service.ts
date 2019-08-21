import { Injectable } from '@angular/core';
import { AngularFireAuth } from  '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-ts';
import { TokenClass } from './tokenClass';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: any;
  email: string;
  title: any;  
  displayMessage: string;
  message: boolean = true;

  constructor(public tokenClass: TokenClass, public  authAf: AngularFireAuth, public router: Router,public http: HttpClient)
  {

  }
/** 
 * Function Name:generateToken
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: retrieves a JWT token from central interface
*/
  public generateToken()
  {
    this.http.post("http://localhost:3000/generateToken",{
      sender: this.email
    },{responseType: 'text'}).subscribe(data=>
    {
      this.user$ = data;
      localStorage.setItem('token', data);
      // Secret Sauce
      this.tokenClass.setEmail(this.email);
      this.tokenClass.setTokenBook();
    });
  }
/** 
 * Function Name:getEmployees
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: retrieves a list of all the employees currently registered.
*/
public getEmployees()
{
  return this.http.post("http://localhost:3000/getEmployeeList",'');
}
/** 
 * Function Name:getTitle
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: retrieves the title of the person logged in. Needed for secret s auce
*/
  public getTitle()
  {
    this.http.post("http://localhost:3000/getTitle",{
      email:this.email
    }).subscribe(data=>
    {
      this.title = data;
    });
    // for the secret sauce
    this.tokenClass.incrementNum();
  }

/** 
 * Function Name:login
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: foundation laying
*/
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
          }, 1000);
          
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
  /** 
 * Function Name:getSecret
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: this is where the secret sauce is made
*/
  public getSecret()
  {
    const tokenBook = this.tokenClass.getTokenBook();
    if(tokenBook == undefined|| tokenBook == null)
    {
      return null;
    }

    const count =  tokenBook;
    let s = '';

    for (let index = 0; index < count; index++)
    {
        s += this.title;
    }
    const hash = crypto.SHA256(s);
    const shortHash = hash[0] + hash[7] + hash[23] + hash[39] + hash[46] + hash[55];
    return shortHash;
  }
/** 
 * Function Name:isAuthenticated
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: checks if a token exists
*/
  public isAuthenticated() : boolean
  {
    const token = localStorage.getItem('token');
    console.log("Token: ",token);
    if(token)
    {
      return true;
    }
    return false;
  }
/** 
 * Function Name:logout
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: deletes the token
*/
  public logout()
  {
    console.log("Removing Token");
    localStorage.removeItem('token');
  }
}
