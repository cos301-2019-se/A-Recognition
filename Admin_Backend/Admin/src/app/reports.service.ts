import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  getAllReports()
  {
    return this.http.get('http://localhost:60090/api/getReports');
  }

  searchReports(name:string)
  {
    return this.http.get('http://localhost:60090/api/Disease/getDiseaseById/'+name);
  }
}
