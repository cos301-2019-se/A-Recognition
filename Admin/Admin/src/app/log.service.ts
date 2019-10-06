import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(public http: HttpClient) { }
  log(msg: any, userNow: any, categoryNow: any) {
    // Log everything that happens
    const dateNow = new Date();
    this.http.post('http://localhost:3000/log',
    {
      date: dateNow,
      description: msg,
      user: userNow,
      category: categoryNow
    }).subscribe(data=>
      {
        console.log(data);
      });
  }
}
