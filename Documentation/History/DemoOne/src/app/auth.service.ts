import { Injectable} from '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
import { Observable } from 'rxjs';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   user$: User;
  // user$: Observable<User>; 
  // calendarItems: any[];
  public message:boolean =true;
  public displayMessage:string;

  constructor(public  authAf:  AngularFireAuth, public  router:  Router) 
  {
    this.authAf.authState.subscribe(user => {
      if (user) {
        this.user$ = user;
        localStorage.setItem('user', JSON.stringify(this.user$));
      } else {
        localStorage.setItem('user', null);
      }
    })
    // this.initClient();
    // this.user$ = authAf.authState;
  }
  
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

}
// initClient()
  // {
  //   gapi.load('client', () => {
  //     console.log('loaded client')

  //     // It's OK to expose these credentials, they are client safe.
  //     gapi.client.init({
  //       apiKey: 'AIzaSyBZBjbJQEstJ1Qjx9bP8kIejypgXUsN1CM',
  //       clientId: '754403435763-s90cpnbn2ldbso2kn7r6ren9aqcscoor.apps.googleusercontent.com',
  //       discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  //       scope: 'https://www.googleapis.com/auth/calendar'
  //     })

  //     gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));

  //   });
  // }
  // async login()
  // {
  //   const googleAuth = gapi.auth2.getAuthInstance()
  //   const googleUser = await googleAuth.signIn();
  
  //   const token = googleUser.getAuthResponse().id_token;
  
  //   const credential = auth.GoogleAuthProvider.credential(token);
  
  //   await this.authAf.auth.signInAndRetrieveDataWithCredential(credential);
  
    
  // }
  
  // logout() {
  //   this.authAf.auth.signOut();
  // }
  // async getCalendar() {
  //   const events = await gapi.client.calendar.events.list({
  //     calendarId: 'primary',
  //     timeMin: new Date().toISOString(),
  //     showDeleted: false,
  //     singleEvents: true,
  //     maxResults: 10,
  //     orderBy: 'startTime'
  //   })
  
  //   console.log(events)
  
  //   this.calendarItems = events.result.items;

  
  // }