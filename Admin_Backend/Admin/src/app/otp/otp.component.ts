import { Component, OnInit } from '@angular/core';
import { OtpCallsService } from '../otp-calls.service';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OTPComponent implements OnInit {

  eventList: any;
  constructor(public otpCall: OtpCallsService) 
  { 

  }

  ngOnInit() 
  {
    this.otpCall.getList().subscribe( (res)=>
    {
      this.eventList = res;
    });
  }

  public generateOTP(email: any, event: any)
  {
    this.otpCall.manualOTP(email, event).subscribe( (res)=>
    {

    });
  }

}
