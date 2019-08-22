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
    return this.http.post('https://a-recognition.herokuapp.com/getEventList', '');
  }
  public manualOTP(emailin: any, eventin: any, broadcastIN: any)
  {
    // for the secret sauce
    this.tokenClass.incrementNum();
    return this.http.post('https://a-recognition.herokuapp.com/generateOTP', {
      eventId : eventin,
      email : emailin,
      broadcast: broadcastIN
    }); 
  }
}
