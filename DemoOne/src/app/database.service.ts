import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { snapshotChanges } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db:AngularFirestore) { }
  list;
  BoardRoomRegistration(name)
  {
    return this.db.collection('boardRooms').add({
      name: name,
      searchableName: name.toLowerCase(),
      bookings:[{}]
    });
  }
  boardRoomBooking(name,d)
  {
    var obj = [{"date":d[0],"time":d[1]}];
    const refe = this.db.collection('boardRooms').doc(name).ref.get().then((o)=>
    {
      this.list= o.data().bookings;
      this.list.push(obj);
      this.list = this.list.map((obj)=> {return Object.assign({}, obj)});
      console.log(this.list);
    });
    return this.db.collection('boardRooms').doc(name).update({"bookings":this.list});//.update({"bookings":[{"date":d[0],"time":d[1]}]});
    
  }
  getRooms()
  {
    return this.db.collection('boardRooms').snapshotChanges();
  }
  getRoomsByName()
  {
    // return this.db.collection('boardRooms').snapshotChanges();
    return this.db.collection("boardRooms").get();
    
  }
  
}
