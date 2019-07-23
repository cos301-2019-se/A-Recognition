import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


  public uploadImage(image: File): Observable<any> {// <response>
    const formData = new FormData();

    formData.append('image', image);

    return ;//this.http.post('/api/v1/image-upload', formData);
  }
}
