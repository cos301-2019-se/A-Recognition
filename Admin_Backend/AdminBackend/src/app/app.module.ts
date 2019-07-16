import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
//import { ReactiveFormsModule } from '@angular/forms';

import { LoginService } from './login/login.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { HttpClientModule, HttpClient } from '@angular/common/http';  
//import { MatButtonModule, MatMenuModule, MatDatepickerModule,MatNativeDateModule , MatIconModule, MatCardModule, MatSidenavModule,MatFormFieldModule, MatInputModule, MatTooltipModule, MatToolbarModule } from '@angular/material';  
//import { MatRadioModule } from '@angular/material/radio';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  
    ReactiveFormsModule,  
    HttpClientModule,  
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [HttpClientModule, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
