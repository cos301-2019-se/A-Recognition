import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { Observable,interval} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public router: Router,public http: HttpClient) 
  { 

  }
  public generateToken()
  {
    return new Promise((res,rej)=>
    {
      this.http.get('http://localhost:3000/generateToken').subscribe(data=>
      {
        console.log(data);
        localStorage.setItem('token', JSON.stringify(data));
        res(data);
      });
    });   
  }
  public validateOneTimePin(eventID: any, otpin: any)
  {
    return new Promise((res,rej)=>
    {
      this.http.post('https://a-recognition.herokuapp.com/validateOTP',
      {
        eventId: eventID,
        otp: otpin
      }).subscribe((response) =>
      {
        res(response);
      },(err)=>
      {
        rej(err);
      });
    });
  }
  public getList()
  {
    return new Promise((res, rej) =>
    {
      return this.http.post('https://a-recognition.herokuapp.com/getEventList', '').subscribe((response) =>
      {
        res(response);
      }, (err) =>{
        rej(err);
      });
    });
  }
}
