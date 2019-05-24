/**
* @file login.components.ts
* @brief This file is used to log in a user and reroute them to the correct page
*
* @author Richard McFadden
*
* @date 04/29/2019
*/
import { Component, OnInit,ElementRef } from '@angular/core';
import {AuthService} from '../auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService,private formBuilder: FormBuilder,private _elementRef : ElementRef) { }

  userLogin:FormGroup;
  userRegistration:FormGroup;
  public user:string="Hello"

  ngOnInit() {
    this.userLogin = this.formBuilder.group({
      username: ['', [Validators.required]],
       password: ['', [Validators.required]],
     });
     this.userRegistration = this.formBuilder.group({
      user: ['', [Validators.required]],
      pass: ['', [Validators.required]],
     });
  }
/** @brief Registration class. Calls the auth service which registers users on firebase

    Detailed description follows here.
    @author Richard McFadden
    @date April 2019
    @param username
    @param password
*/
  Register(username:string,password:string)
  {
  //   let registerButton = this._elementRef.nativeElement.querySelector(`#registerButton`);
  //   registerButton.appendClass()
    this.authService.Register(username,password);
  }
  onSubmit(buttonItem)
  {
    
    // if(this.userLogin){
    //   this.authService.login(this.userLogin.controls["username"].value,(this.userLogin.controls["password"].value).toString);
    // }
    
  }

}
