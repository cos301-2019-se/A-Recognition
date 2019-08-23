import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
//import { ReactiveFormsModule } from '@angular/forms';

import { LoginService } from './login/login.service';
//import {MatInputModule,MatOptionModule, MatSelectModule, MatIconModule} from '@angular/material'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { HttpClientModule, HttpClient } from '@angular/common/http';  
import { MatButtonModule, MatMenuModule, MatDatepickerModule,MatNativeDateModule , MatIconModule, MatCardModule, MatSidenavModule,MatFormFieldModule, MatInputModule, MatTooltipModule, MatToolbarModule } from '@angular/material';  
import { MatRadioModule } from '@angular/material/radio';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './admin/admin.service';
import { RegisterComponent } from './register/register.component';
import { OtpComponent } from './otp/otp.component';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    RegisterComponent,
    OtpComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  
    ReactiveFormsModule,  
    HttpClientModule,  
    BrowserAnimationsModule,
    MatButtonModule,  
    MatMenuModule,  
    MatDatepickerModule,  
    MatNativeDateModule,  
    MatIconModule,  
    MatRadioModule,  
    MatCardModule,  
    MatSidenavModule,  
    MatFormFieldModule,  
    MatInputModule,  
    MatTooltipModule,  
    MatToolbarModule,
    AppRoutingModule
  ],
  providers: [HttpClientModule, LoginService, AdminService, MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
