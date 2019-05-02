import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { getUserMedia } from 'getusermedia-js';
import { log } from 'util';
//import * as modelURL from 'src/assets/ssd_mobilenetv1_model-weights_manifest.json';
//Detection
//import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';
import { database } from 'firebase';
import { DatabaseService } from '../database.service';
import { url } from 'inspector';
import { imag } from '@tensorflow/tfjs-core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recogition',
  templateUrl: './recogition.component.html',
  styleUrls: ['./recogition.component.css']
})
export class RecogitionComponent implements OnInit {

  @ViewChild("screen") screen : ElementRef;
  @ViewChild("canvas") canvas : ElementRef;
  @ViewChild("notifyer") notifyer : ElementRef;

  recording = false;
  boardRooms = [];
  selectedRoom :string = "";
  correspondingRoom;
  notificationClass = "";
  alert = "";
  alerting = false;
  authorised = false;

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

    }).catch(function(err){
      console.log(err);
      console.log(err.name);
      console.log(err.message);
      
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
   
      if(facialDetails[0].faceAttributes.gender == "male"){
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
    this.alert = "There are no bookings, you may enter.";
    this.alerting = true;
    setTimeout(()=> this.alerting = false,3000);
  }else{
    this.alert = "Room booked, please identify yourself.";
    this.alerting = true;
    this.recording = true;
    setTimeout(()=> {
      this.alerting = false;
      this.recording = false;

      if(this.authorised == true){
        this.alert = "Welcome Mr Jarrod";
        this.alerting = true;

        setTimeout(()=> {
          this.alerting = false;
        },5000);
      }
    },3000);
  }

}

}
