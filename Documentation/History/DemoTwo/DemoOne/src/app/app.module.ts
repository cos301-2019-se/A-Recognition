import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {AngularFireModule} from "@angular/fire";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from "@angular/fire/auth";
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import {HttpClientModule} from '@angular/common/http';
import { FRComponent } from './fr/fr.component';
import {FormsModule} from "@angular/forms";
var config = {
  apiKey: "AIzaSyBZBjbJQEstJ1Qjx9bP8kIejypgXUsN1CM",
  authDomain: "capstoneusers-b474f.firebaseapp.com",
  databaseURL: "https://capstoneusers-b474f.firebaseio.com",
  projectId: "capstoneusers-b474f",
  storageBucket: "capstoneusers-b474f.appspot.com",
  messagingSenderId: "754403435763"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FRComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule, ReactiveFormsModule,AngularFirestoreModule,AngularFireDatabaseModule,HttpClientModule,FormsModule
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
