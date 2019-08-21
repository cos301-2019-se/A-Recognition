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
  brdCast :any;
  constructor(public otpCall: OtpCallsService,private formBuilder: FormBuilder) 
  { 

  }

  ngOnInit() 
  {
    this.otpCall.getList().subscribe( (res)=>
    {
      this.eventList = res;
      console.log(this.eventList);
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
  public generateOTP(email: any, event: any, broadCast: any)
  {
    console.log(broadCast);
    if(broadCast == 'broadCast')
    {
      this.brdCast = true;
    }
    else
    {
      this.brdCast = false;
    }
    
    this.otpCall.manualOTP(email, event, this.brdCast).subscribe( (res)=>
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
