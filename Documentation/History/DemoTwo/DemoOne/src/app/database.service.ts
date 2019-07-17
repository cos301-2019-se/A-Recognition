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
  list:Object[]=[];
  newObj:Object;
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
      // o.data().booking.forEach(element => {
      //   this.list.push(element);
      // });
      if(o.data().bookings[0])
      this.list.push(o.data().bookings[0]);
      this.list.push(objD);
      // this.list = this.list.map((obj)=> {return Object.assign({}, obj)});
      this.newObj = this.list.map((obj)=> {return Object.assign({}, obj)});// Object.assign({}, ...this.list);
      console.log(this.newObj );
     return this.db.collection('boardRooms').doc(name).update({"bookings":this.newObj});
    });
    // return this.db.collection('boardRooms').doc(name).update({"bookings":this.list});//.update({"bookings":[{"date":d[0],"time":d[1]}]});
    // this.list = this.db.collection('boardRooms').doc(name).collection("bookings");
    
   
  }
  pleaseWork(snapshot)
  {
    const arr= [];
    snapshot.array.forEach(element => {
      const item = element;
      arr.push(item);
    });
    console.log(arr);
    return arr;
  }
  getRooms()
  {
    return this.db.collection('boardRooms').snapshotChanges();
  }
  getRoomsByName(deviceValue)
  {
    // return this.db.collection('boardRooms').snapshotChanges();
    return this.db.collection("boardRooms").get();
    
  }
  
}
