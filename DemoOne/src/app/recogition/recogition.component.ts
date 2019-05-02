import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { getUserMedia } from 'getusermedia-js';
import { log } from 'util';

@Component({
  selector: 'app-recogition',
  templateUrl: './recogition.component.html',
  styleUrls: ['./recogition.component.css']
})
export class RecogitionComponent implements OnInit {

  @ViewChild("screen") screen : ElementRef;

  constructor() { }

  ngOnInit() {

    var constraints = {
      audio: false,
      video:true//{width: 640,height: 480}
    }

    console.log(this.screen);

    const getUserMedia =  navigator.mediaDevices.getUserMedia(
      constraints).then( function(stream){
    
        console.log(stream);
        
        //screen.srcObject = stream;
        //screen.play();
      }).catch(function(err){
        console.log(err.name);
        console.log(err.message);
        
      } 
    );
}
 
}
