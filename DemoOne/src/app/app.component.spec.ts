import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {AngularFireModule} from "@angular/fire";

import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule, AngularFireAuth} from "@angular/fire/auth";
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreSettingsToken} from '@angular/fire/firestore';

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

describe('AppComponent', () => {
  const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'login',component:LoginComponent}
  ];
  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
     
      imports: [

        RouterTestingModule,
        AngularFireModule.initializeApp(config),
        AngularFireAuthModule,
        ReactiveFormsModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,RouterModule
        
      ],
      declarations: [
        AppComponent,HomeComponent,LoginComponent
      ],
      providers: [{ provide: FirestoreSettingsToken, useValue: {} },{provide:AngularFireAuthModule},{provide:AngularFireAuth},{provide:RouterModule}],
      
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'DemoOne'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('DemoOne');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to DemoOne!');
  });
});
