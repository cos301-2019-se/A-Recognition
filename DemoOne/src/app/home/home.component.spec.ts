import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { LoginComponent } from '../login/login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes, RouterModule } from '@angular/router';
import {AngularFireModule} from "@angular/fire";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from "@angular/fire/auth";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  var config = {
    apiKey: "AIzaSyBZBjbJQEstJ1Qjx9bP8kIejypgXUsN1CM",
    authDomain: "capstoneusers-b474f.firebaseapp.com",
    databaseURL: "https://capstoneusers-b474f.firebaseio.com",
    projectId: "capstoneusers-b474f",
    storageBucket: "capstoneusers-b474f.appspot.com",
    messagingSenderId: "754403435763"
  };
  beforeEach(async(() => {
    const routes: Routes = [
      {path:'',component:LoginComponent},
      {path:'home',component:HomeComponent},
      {path:'login',component:LoginComponent}
    ];
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule, AngularFireModule.initializeApp(config),
        AngularFireAuthModule, ReactiveFormsModule,AngularFirestoreModule,AngularFireDatabaseModule,
          RouterTestingModule
    ],
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should set submitted to true', async(() => {
  //   component.onSubmit();
  //   expect(component.submitted).toBeTruthy();
  // }));
  // it('form should be invalid', async(() => {
  //   component.onSubmit();
  //   expect(component.submitted).toBeTruthy();
  // }));
});
