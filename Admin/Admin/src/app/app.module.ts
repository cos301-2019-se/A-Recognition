import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule,} from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';
import { AddingComponent } from './adding/adding.component';
import { OTPComponent } from './otp/otp.component';
import { HomeComponent } from './home/home.component';
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { NavComponent } from './nav/nav.component';
import { WebcamModule } from 'ngx-webcam';
import { EmployeesComponent } from './employees/employees.component';

const firebaseConfig = {
  apiKey: 'AIzaSyBpazWx_m3UGkQAh6zgEMujQ2JtU3OJzEc',
  authDomain: 'arecognition-48c05.firebaseapp.com',
  databaseURL: 'https://arecognition-48c05.firebaseio.com',
  projectId: 'arecognition-48c05',
  storageBucket: 'arecognition-48c05.appspot.com',
  messagingSenderId: '804596652300',
  appId: '1:804596652300:web:8aca815bd216c706'
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReportsComponent,
    AddingComponent,
    OTPComponent,
    HomeComponent,
    NavComponent,
    EmployeesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule, ReactiveFormsModule, AngularFirestoreModule, AngularFireDatabaseModule,
    HttpClientModule,
    FormsModule,WebcamModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: FirestoreSettingsToken, useValue: {} },
    {provide: AngularFireModule}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
