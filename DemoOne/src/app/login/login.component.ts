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

  Register(username:string,password:string)
  {
    let registerButton = this._elementRef.nativeElement.querySelector(`#registerButton`);
    registerButton.appendClass()
    this.authService.Register(username,password);
  }
  onSubmit(buttonItem)
  {
    
    // if(this.userLogin){
    //   this.authService.login(this.userLogin.controls["username"].value,(this.userLogin.controls["password"].value).toString);
    // }
    
  }

}
