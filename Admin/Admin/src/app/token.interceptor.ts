import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/';

@Injectable()
export class TokenInterceptor implements HttpInterceptor 
{
  constructor(public auth: AuthService)
  {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const s = this.auth.getSecret();
    let temp = localStorage.getItem('token');
    temp += s;
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${temp}`
      }
    });
    return next.handle(request);
  }
}
