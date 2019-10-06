import { Injectable } from '@angular/core';
import { AngularFireAuth } from  '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-ts';
import { TokenClass } from './tokenClass';
import { LogService } from './log.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: any;
  email: string;
  title: any;  
  displayMessage: string;
  message: boolean = true;

  // tslint:disable-next-line: max-line-length
  constructor(public log: LogService, public tokenClass: TokenClass, public  authAf: AngularFireAuth, public router: Router, public http: HttpClient)
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
    this.http.post('https://a-recognition.herokuapp.com/generateToken', {
      sender: this.email
    }, {responseType: 'text'}).subscribe(data =>
    {
      if (data == 'null')
      {
        this.displayMessage = 'Error generating a token';
        this.log.log(this.displayMessage,this.email,'token');
      }
      else
      {
        this.user$ = data;
        localStorage.setItem('token', data);
        // Secret Sauce
        this.tokenClass.setEmail(this.email);
        this.tokenClass.setTokenBook();
        this.log.log('Token generated',this.email,'token');
      }
    });

  }
/*
 * Function Name:resetPassword
 * Version: V1
 * Author: Richard McFadden
 * Funtional description: reseting auth password
 */
  public resetPassword(email: string)
  {
    
    return this.authAf.auth.sendPasswordResetEmail(email)
      .then(() => 
      {
        this.displayMessage = 'An email has been sent to ' + email + ' to reset your password.';
        console.log('email sent');
        this.log.log(this.displayMessage,this.email,'passwordReset');
      })
      .catch((error) => 
      {
        this.displayMessage = error;
        this.log.log(this.displayMessage,this.email,'passwordReset');
        console.log(error)
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
  this.log.log('Employee list was retrieved',this.email,'employeeList');
  return this.http.post('http://localhost:3000/getEmployeeList', '');
}
/** 
 * Function Name:getTitle
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: retrieves the title of the person logged in. Needed for secret s auce
*/
  public getTitle()
  {
    this.http.post('https://a-recognition.herokuapp.com/getTitle', {
      email: this.email
    }).subscribe(data =>
    {
      this.title = data;
    });
    // for the secret sauce
    this.tokenClass.incrementNum();

    this.log.log('Employee Title was retrieved',this.email,'employeeList');
  }

/** 
 * Function Name:login
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: foundation laying
*/
  async login(email: string, pass: string)
  {
    try
    {
      this.email = email;
      await this.authAf.auth.signInWithEmailAndPassword(email, pass).then(value =>
        {
          console.log('SUCCESS', value);
          this.getTitle();
          this.generateToken();

          this.log.log('Employee Logged in',this.email,'loggedIn');
          setTimeout(() =>
          {
            this.router.navigate(['home']);
          }, 1000);
          
        }).catch(err =>
          {
            console.log('Something went wrong', err.message);
            this.router.navigate(['login']);
            
            this.displayMessage = err.message;
            this.log.log(this.displayMessage,this.email,'loggedIn');

          });
    }
    catch (e)
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
    if (tokenBook == undefined || tokenBook == null)
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
    console.log('Token: ', token);
    if (token)
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
    console.log('Removing Token');
    this.log.log('Employee Logged out',this.email,'loggedOut');
    localStorage.removeItem('token');
  }
}
