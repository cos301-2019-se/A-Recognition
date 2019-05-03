import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AngularFireModule} from "@angular/fire";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule, AngularFireAuth} from "@angular/fire/auth";
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { LoginComponent } from './login.component';
import { AppComponent } from '../app.component';
import { HomeComponent } from '../home/home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA}from '@angular/core';

//This is for connecting to firebase and using the authentication and login services
var config = {
  apiKey: "AIzaSyBZBjbJQEstJ1Qjx9bP8kIejypgXUsN1CM",
  authDomain: "capstoneusers-b474f.firebaseapp.com",
  databaseURL: "https://capstoneusers-b474f.firebaseio.com",
  projectId: "capstoneusers-b474f",
  storageBucket: "capstoneusers-b474f.appspot.com",
  messagingSenderId: "754403435763"
};
//
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent,HomeComponent,AppComponent ],
      imports: [
        AngularFireModule.initializeApp(config),
        AngularFireAuthModule,
        ReactiveFormsModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,RouterModule.forRoot([])
      ],schemas:[CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide:RouterTestingModule},{ provide: FirestoreSettingsToken, useValue: {} },{provide:AngularFireAuthModule}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  it('should submit', async(() => {
    component.onSubmit();
    expect(component.submitted).toBeTruthy();
  }));
  it('form should be invalid', async(() => {
    component.userRegistrationTest.controls["username"].setValue('');
    component.userRegistrationTest.controls["password"].setValue('');
    expect(!component.userRegistrationTest.valid).toBeTruthy();
  }));
  it('form should be valid', async(() => {
    component.userRegistrationTest.controls["username"].setValue('u1@tuks.co.za');
    component.userRegistrationTest.controls["password"].setValue('test');
    expect(component.userRegistrationTest.valid).toBeTruthy();
  }));
});
