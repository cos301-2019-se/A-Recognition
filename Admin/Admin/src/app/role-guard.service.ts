import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(public auth: AuthService, public router: Router) 
  {

  }

  // ActivatedRouteSnapshot gives us access to properties
  // of the route that is passed through
  // canActivate(route: ActivatedRouteSnapshot): boolean 
  // {
  //   // this will be passed from the route config
  //   // on the data property
  //   const expectedRole = route.data.expectedRole;
  //   const token = localStorage.getItem('token');
  //   // decode the token to get its payload
  //   const tokenPayload = decode(token);
  //   if (!this.auth.isAuthenticated() || tokenPayload.role !== expectedRole)
  //   {
  //     this.router.navigate(['login']);
  //     return false;
  //   }
  //   return true;
  // }

}
