import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService} from '../auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public eventList: any;
  public message: any = '';
  ngOnInit()
  {
    this.auth.getList().then( (res) =>
    {
      console.log(res);
      this.eventList = res;
    });
  }
  constructor(public auth: AuthService)
  { 

  } 

  public validateOTP(eventid: any, otp: any)
  {
    this.auth.validateOneTimePin(eventid, otp).then( (data) =>
    {
      if(data == true){
        this.message = 'You are allowed access to the room now!';
      }
      else
      {
        this.message = 'Either the OTP entered is wrong, expired or you are not allowed in right now.';
      }
    });
  }

}
