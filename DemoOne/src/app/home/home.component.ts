import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import { Router } from  "@angular/router";
import { auth } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService:AuthService,public  router:  Router) { }

  ngOnInit() {
    if(!this.authService.isLoggedIn())
    {
      this.router.navigate(['login']);
    }
  }

}
