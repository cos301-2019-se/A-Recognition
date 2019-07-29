import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


  public uploadImage(image: any): Observable<any> {// <response>
    const formData = new FormData();

    formData.append('image', image);

    return this.http.get('http://localhost:2999/add?name="RichardTest"&surname="TESTER"&title="Mr"&email="Rich@test.com"&images=' + JSON.stringify(image));
  }
}
