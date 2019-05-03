import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { log } from 'util';
import { database } from 'firebase';
import { DatabaseService } from '../database.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recogition',
  templateUrl: './recogition.component.html',
  styleUrls: ['./recogition.component.css']
})
export class RecogitionComponent implements OnInit {

  @ViewChild("screen") screen : ElementRef;
  @ViewChild("canvas") canvas : ElementRef;

  recording = false;
  boardRooms = [];
  selectedRoom :string = "";
  correspondingRoom;
  notificationClass = "";
  alertMessage = "";
  alerting = false;
  warnMessage = "";
  warning = false;

  authorised = false;
  emptyView = false;

  constructor(private dataService : DatabaseService) {}

  ngOnInit() {
    this.dataService.getRoomsByName().subscribe((data)=>
    {
      data.docs.forEach((doc)=>
      {
          this.boardRooms.push(doc.data()); 
      });
    });
}

  ngAfterViewInit(){
  var constraints = {
    audio: false,
    video:true
  }


  const getUserMedia =  navigator.mediaDevices.getUserMedia(constraints)
  .then(stream =>{
      this.screen.nativeElement.srcObject = stream;
      this.screen.nativeElement.play();

    }).catch(err =>{
      console.log(err);
      console.log(err.name);
      console.log(err.message);

      if(err.name == "NotFoundError"){
        this.warnMessage = "No camera connected!";
        this.warning = true;
        setTimeout(()=>{
          this.warning = false;
        },5000);
      }
      
    } 
  );

  setInterval( () =>{

    if(this.recording)
    this.getImage();

  },1000);
}
getImage(){
  const context = this.canvas.nativeElement.getContext('2d');
  context.drawImage(
    this.screen.nativeElement,
    0,
    0,
    300,
    200
  );
  const url = this.canvas.nativeElement.toDataURL('image/png'); // base64 
  //console.log(url);
  
  this.scanImage(url);
  
  return url;
}

scanImage(base64Image: string) {
   this.dataService.detectFace(base64Image).subscribe( facialDetails =>{
   
    if(facialDetails[0] == undefined || facialDetails[0] == null && this.authorised != true){
      this.emptyView = true;
      this.authorised = false;
    }else if(facialDetails[0].faceAttributes.gender == "male"){
        this.authorised = true;
        console.log("Authorised");
      }
  
      console.log(facialDetails[0].faceAttributes);

  });
}

stop(){
  this.recording = !this.recording;
}
 
selectRoom(){
  console.log(this.selectedRoom);
  this.authorised = false;

  this.boardRooms.forEach(room => {
    if(room.name == this.selectedRoom)
    this.correspondingRoom = room;
  });
  
  if(this.correspondingRoom.bookings.length == 0)
  this.authenticate(true);
  else 
  this.authenticate(false);
}

authenticate(isAllowed){

  if(isAllowed){
    this.alertMessage = "There are no bookings, you may enter.";
    this.alerting = true;
    setTimeout(()=> this.alerting = false,3000);
  }else{
    this.alertMessage = "Room booked, please identify yourself.";
    this.alerting = true;
    this.recording = true;
    setTimeout(()=> {
      this.alerting = false;
      this.recording = false;

      if(this.authorised == true){
        this.alertMessage = "Welcome Mr Jarrod";
        this.alerting = true;

        setTimeout(()=> {
          this.alerting = false;
        },5000);
      }else{

        if(this.emptyView)
        this.warnMessage = "Please position yourself infront of the camera";
        else
        this.warnMessage = "Access denied Ma'am";
        this.warning = true;

        setTimeout(()=> {
          this.warning = false;
          this.emptyView = false;
        },5000);
      }
    },3000);
  }

}

}
