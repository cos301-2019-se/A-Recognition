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
/*
 * Function Name:generateTOken
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: gets a token from CI
*/
  public generateToken()
  {
    return new Promise((res,rej)=>
    {
      this.http.get('https://a-recognition.herokuapp.com/generateToken').subscribe(data=>
      {
        console.log(data);
        localStorage.setItem('token', JSON.stringify(data));
        res(data);
      });
    });   
  }
/** 
 * Function Name:validateOneTimePIN
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: returns true or false
*/
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
/** 
 * Function Name:getList
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: returns an eventLIST
*/
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
  /** 
 * Function Name:validateOneTimePINByRoom
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: returns true or false
*/
public validateOneTimePinByRoom(room: any, otpin: any)
{
  return new Promise((res, rej) =>
  {
    this.http.post('https://a-recognition.herokuapp.com/validateOTPByRoom',
    {
      roomID: room,
      otp: otpin
    }).subscribe((response) =>
    {
      res(response);
    }, (err) =>
    {
      rej(err);
    });
  });
}
}
