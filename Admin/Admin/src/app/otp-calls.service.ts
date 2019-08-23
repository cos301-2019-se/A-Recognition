import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { TokenClass } from './tokenClass';
@Injectable({
  providedIn: 'root'
})
export class OtpCallsService {

  constructor(public tokenClass: TokenClass, public router: Router, public http: HttpClient) 
  { 

  }
  public getList()
  {
    this.tokenClass.incrementNum();
    return this.http.post('http://localhost:3000/getEventList', ''); // https://a-recognition.herokuapp.com
  }
  public manualOTP( eventin: any, broadcastIN: any)
  {
    // for the secret sauce
    console.log(eventin);
    this.tokenClass.incrementNum();
    return this.http.post('http://localhost:3000/generateOTP', {
      eventId : eventin,
      broadcast: broadcastIN
    });
  }
}
