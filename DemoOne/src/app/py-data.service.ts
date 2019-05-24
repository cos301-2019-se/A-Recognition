import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PyDataService {

  constructor(private http:HttpClient) { }
  RegisterUser(name,surname,title,imageName) {
    return this.http.get('http://127.0.0.1:5002/registerUser/'+name+'/'+surname+'/'+title+'/'+imageName);
  }
  verifyUser(imageName)
  {
    return this.http.get('http://127.0.0.1:5030/authenticate/' +imageName);
  }
}
