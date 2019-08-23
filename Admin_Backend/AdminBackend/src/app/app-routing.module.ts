import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { OtpComponent } from './otp/otp.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'app', component: AppComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'otp', component: OtpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
