import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Variables
  user$: User;
  loggedINTest:boolean;
  public message:boolean =true;
  public displayMessage:string;
  //
  constructor(public  authAf:  AngularFireAuth, public  router:  Router)
  {
    //On create the token
    this.authAf.authState.subscribe(user => {
      if (user) 
      {
        this.user$ = user;
        localStorage.setItem('user', JSON.stringify(this.user$));
      } else 
      {
        localStorage.setItem('user', null);
      }
    })
   }

   //All functions needed for logging, Register, checking if logged in 
  async login(email:string,password:string)
  {
    try{
      await this.authAf.auth.signInWithEmailAndPassword(email,password);
      this.router.navigate(['home']);
    }catch(e)
    {
      this.message= false;
      this.displayMessage= e.message;
      console.log(this.displayMessage);
      //alert("Error has occured!"+e.message);
    }
  }
  async Register(email:string,password:string)
  {
    try{
      await this.authAf.auth.createUserWithEmailAndPassword(email,password);
      
    }catch(e)
    {
      alert("Error has occured!"+e.message);
    }
   }
  async logout()
  {
    await this.authAf.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
  isLoggedIn()
  {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }
  testFunction()
  {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }
}
