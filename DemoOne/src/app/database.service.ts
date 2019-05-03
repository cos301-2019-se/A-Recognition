import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { snapshotChanges } from '@angular/fire/database';
import { Observable } from 'rxjs';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  subscriptionKey = "b120e8a674724c89b4ee3cfa8bbd3b5d";
  apiURL = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

  constructor(private db:AngularFirestore,private http : HttpClient) { }

  //variables
  list:Object[]=[];
  newObj:Object;
  //
  //Functions
  BoardRoomRegistration(name)
  {
    return this.db.collection('boardRooms').add({
      name: name,
      searchableName: name.toLowerCase(),
      bookings:[]
    });
  }
  boardRoomBooking(name,d)
  {    
    const refe = this.db.collection('boardRooms').doc(name).ref.get().then((o)=>
    {
      var objD = {"date":d[0],"time":d[1]};
      //Check if there are values already. If not do not push to list
      if(o.data().bookings[0])
      {
        this.list.push(o.data().bookings[0]);
      }      
      this.list.push(objD);
      this.newObj = this.list.map((obj)=> {return Object.assign({}, obj)});

     return this.db.collection('boardRooms').doc(name).update({"bookings":this.newObj});
    });
  }
  getRooms()
  {
    return this.db.collection('boardRooms').snapshotChanges();
  }
  getRoomsByName()
  {
    return this.db.collection("boardRooms").get(); 
  }

  //It gets hairy down here
   getHeaders() {
    let headers = new  HttpHeaders();
    headers = headers.set('Content-Type', 'application/octet-stream');
    headers = headers.set('Ocp-Apim-Subscription-Key', this.subscriptionKey);

    return headers;
}

 getParams() {
  const httpParams = new HttpParams()
    .set('returnFaceId', 'true')
    .set('returnFaceLandmarks', 'false')
    .set(
        'returnFaceAttributes',
        'age,gender,smile,facialHair,hair,occlusion,blur,exposure,noise'
    );

    return httpParams;
}

 makeblob(url) {
  const BASE64_MARKER = ';base64,';
  const parts = url.split(BASE64_MARKER);
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

detectFace(base64Image){

  var headers = this.getHeaders();
  var params = this.getParams();
  var blob = this.makeblob(base64Image);

  return this.http.post(
    this.apiURL,
    blob,
    {params,headers}
  ).pipe(map(result => result));
}

}
