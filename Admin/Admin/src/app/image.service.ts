import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


  public uploadImage(body: any): Observable<any> 
  {
    // let config = {
    //   headers: {
    //      'Content-Type': 'multipart/form-data'//'application/x-www-form-urlencoded'
    //   }
  // };
    return this.http.post('http://localhost:3000/addEmployee', body);
  }
}
