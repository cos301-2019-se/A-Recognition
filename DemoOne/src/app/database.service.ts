import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db:AngularFirestore){ }
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
  getRoomsByName(deviceValue)
  {
    return this.db.collection("boardRooms").get(); 
  }
}
