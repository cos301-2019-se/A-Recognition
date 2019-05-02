import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AuthService} from './auth.service';
import {DatabaseService} from './database.service';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import {AngularFireModule} from "@angular/fire";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from "@angular/fire/auth";
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { APP_BASE_HREF } from '@angular/common';

let login;
let home;
let appC;
describe('AppComponent', () => {
  const routes:Routes=[
    {path:'',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'login',component:LoginComponent}
  ]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, BrowserModule,
        AppRoutingModule,
        AngularFireAuthModule, ReactiveFormsModule,AngularFirestoreModule,AngularFireDatabaseModule,
      ],
      declarations: [
        AppComponent,HomeComponent,LoginComponent
      ], providers: [{ provide: FirestoreSettingsToken, useValue: {} },{AuthService},{provide: APP_BASE_HREF, useValue : '/'}],
     
    }).compileComponents().then(()=>
    {
      login = TestBed.createComponent(LoginComponent);
      home = TestBed.createComponent(HomeComponent);
      appC = TestBed.createComponent(AppComponent);
    });
  }));

  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   fixture.detectChanges();
  //   expect(app).toBeTruthy();
  // });

  // it(`should have as title 'DemoOne'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect('DemoOne').toContain('DemoOne');
  // });

  // it('should render title in a h1 tag', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect('Welcome to DemoOne!').toContain('Welcome to DemoOne!');
  // });
});
