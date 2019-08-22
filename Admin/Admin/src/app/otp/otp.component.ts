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
  brdCast: any = false;
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
  onItemChange(value){
    console.log('Value is: ', value );
    this.brdCast = true;
 }
/** 
 * Function Name:generateOTP
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: sends the request to manually generate OTP
*/
  public generateOTP(event: any)
  {
    
    this.otpCall.manualOTP(event, this.brdCast).subscribe( (res)=>
    {
      console.log(res);
      if (res == true)
      {
        if(this.brdCast == true)
        {
          this.message = 'OTP was generated. An email was sent';
        }else
        {
          this.message = 'OTP was generated.';
        }
        
        this.valid = true;
      }
      else{
        this.message = 'An error occured during OTP generation.';
        this.valid = false;
      }
    });
  }

}
