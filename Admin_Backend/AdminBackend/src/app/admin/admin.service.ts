import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../employee';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllEmployees()
  {
    return this.http.get('http://localhost:52892/api/Employee/getAllEmployees');
  }

  getEmployeeById(Employee:number)
  {
    return this.http.get('http://localhost:60090/api/Employee/getEmployeeById/'+Employee);
  }

  addEmployee(Employee:Object)
  {
    return this.http.post('http://localhost:52892/api/Employee/addEmployee', Employee);
  }

  updateEmployee(Employee:Object)
  {
    return this.http.post('http://localhost:60090/api/Employee/updateEmployee', Employee);
  }

  deleteEmployeeById(Employee:string)
  {
    return this.http.delete('http://localhost:52892/api/Employee/deleteEmployee/'+Employee,);
  }

  searchEmployee(user: object)//, pass)
  { 
    //let body = new HttpParams().set('name', user);
    return this.http.post<any>('http://localhost:52892/api/Employee/searchEmployees', user);//, pass});
  }
}
