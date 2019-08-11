import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AddingComponent } from './adding/adding.component';
import { OTPComponent } from './otp/otp.component';
import { ReportsComponent } from './reports/reports.component';

// PREVENT ACTIVATION BY USING
//canLoad instead of canActivate
const routes: Routes =
[
  { path: '',
    component: LoginComponent 
  },
  { path: 'login',
  component: LoginComponent 
  },
  { 
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'adding',
    component: AddingComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'otp',
    component: OTPComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard] 
  },
  { path: '**',
    redirectTo: '' 
  }
  //Add this later on when more roles are defined
  /*
   { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [RoleGuard], 
    data: { 
      expectedRole: 'admin'
    } 
  },
  */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
