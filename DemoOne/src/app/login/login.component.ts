import { Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService,private formBuilder: FormBuilder) { }
  //Variables
  userLogin:FormGroup;
  userRegistration:FormGroup;
  userRegistrationTest:FormGroup;
  submitted:boolean=false;
  inLog:boolean=false;
  //
  ngOnInit() 
  {
    this.userLogin = this.formBuilder.group({
      username: ['', [Validators.required]],
       password: ['', [Validators.required]],
     });
     this.userRegistrationTest = new FormGroup({
      'username':new FormControl('',[Validators.required]),
      'password':new FormControl('',[Validators.required])
     });
     this.userRegistration = this.formBuilder.group({
      user: ['', [Validators.required]],
      pass: ['', [Validators.required]],
     });
  }
  //Functions
  Register(username:string,password:string)
  {
    this.authService.Register(username,password);
  }
  onSubmit()
  {
    this.submitted= true;
  }
}
