import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(public http: HttpClient) {

   }
  getAllReports()
  {
    return this.http.post('http://localhost:3000/getReports', '');
  }

  searchReportsByTime(timeToSearch: string)
  {
    return this.http.post('http://localhost:3000/getReportByTime',{
      time: timeToSearch
    });
  }
}
