import { Component, OnInit } from '@angular/core';
import { OtpCallsService } from '../otp-calls.service';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OTPComponent implements OnInit {

  eventList: any;
  message: any;
  valid: any;
  otpSub: FormGroup;
  constructor(public otpCall: OtpCallsService,private formBuilder: FormBuilder) 
  { 

  }

  ngOnInit() 
  {
    this.otpCall.getList().subscribe( (res)=>
    {
      this.eventList = res;
    });
    this.otpSub = this.formBuilder.group(
      {
        email: ['', [Validators.required]],
        event: ['', [Validators.required]],
      });
  }
/** 
 * Function Name:generateOTP
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: sends the request to manually generate OTP
*/
  public generateOTP(email: any, event: any)
  {
    this.otpCall.manualOTP(email, event).subscribe( (res)=>
    {
      if (res === true)
      {
        this.message = 'OTP was generated. An email will be send.';
        this.valid = true;
      }
      else{
        this.message = 'An error occured during OTP generation.';
        this.valid = false;
      }
    });
  }

}
