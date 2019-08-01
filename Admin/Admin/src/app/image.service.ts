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
  public uploadImageTaken(img, name, surname, title, email): Observable<any> 
  {
    const temp = '?image=' + img + '&name=' + name + '&surname=' + surname + '&title=' + title + '&email=' + email;
    return this.http.get('http://localhost:3000/addEmployeeTaken' + temp);
  }
}
