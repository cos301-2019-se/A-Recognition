import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import {AuthService} from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(public authService: AuthService, private formBuilder: FormBuilder) 
  { 

  }
  userLogin: FormGroup;

  ngOnInit() 
  {
    this.userLogin = this.formBuilder.group(
    {
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

}
