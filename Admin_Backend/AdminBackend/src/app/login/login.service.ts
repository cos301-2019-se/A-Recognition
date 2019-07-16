import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
//import { Login } from './login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  searchEmployee(user)//, pass)
  { 
    let body = new HttpParams().set('name', user);
    return this.http.post<any>('http://localhost:52892/api/Employee/searchEmployees', body);//, pass});
  }
  getEmployees()
  { 
    return this.http.get('http://localhost:52892/api/Employee/getAllEmployees');
  }
}
