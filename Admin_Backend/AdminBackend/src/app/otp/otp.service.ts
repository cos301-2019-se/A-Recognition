import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../employee';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient) { }

  addOTP(Employee:Object)
  {
    return this.http.post('http://localhost:52892/api/Employee/addEmployee', Employee);
  }
}
