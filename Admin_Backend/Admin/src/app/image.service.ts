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
    return this.http.post('http://localhost:3000/addEmployee', body);
  }
  public uploadImageTaken(img,name,surname,title,email): Observable<any> 
  {
    const formData:FormData = new FormData();
    formData.append('image', img);
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('email', email);
    formData.append('title', title);
    return this.http.post('http://localhost:3000/addEmployee', formData);
  }
}
