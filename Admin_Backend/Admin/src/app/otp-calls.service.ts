import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OtpCallsService {

  constructor( public router: Router, public http: HttpClient) 
  { 

  }
  public getList()
  {
    return this.http.post('http://localhost:3000/getEventList', '');
  }
  public manualOTP(emailin: any, eventin: any)
  {
    return this.http.post('http://localhost:3000/generateOTP', {
      eventId : eventin,
      email : emailin
    });
  }
}
