import {  Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup ,FormBuilder,Validators} from '@angular/forms';
import {PyDataService} from '../py-data.service';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-fr',
  templateUrl: './fr.component.html',
  styleUrls: ['./fr.component.css']
})
export class FRComponent implements OnInit {
  
  @ViewChild("video")
    public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

   captures: Array<any>;
   message : String="";
   imageName:any;
   counter:any=0;
   valid:Boolean;
   base64IMGTWO:String;
  constructor(private data:PyDataService,private formBuilder: FormBuilder) { 
    this.captures =[];
  }

  ngOnInit() {
  }
  public ngAfterViewInit() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this.video.nativeElement.srcObject = stream;//window.URL.createObjectURL(stream);
            this.video.nativeElement.play();
        });
    }
  }

  public capture() {
    return new Promise((res,rej)=>
      {
        var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
        this.captures.push(this.canvas.nativeElement.toDataURL("image/jpg"));
        
        var base64Img =atob(this.canvas.nativeElement.toDataURL("images/png").replace(/^.*?base64,/, '')),//this.convertCanvasToImage(this.canvas.nativeElement);
        asArray = new Uint8Array(base64Img.length);

        for( var i = 0, len = base64Img.length; i < len; ++i ) {
            asArray[i] = base64Img.charCodeAt(i);    
        }

        var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );
       // console.log(base64Img);

        this.imageName = "test"+this.counter+".png";
        this.counter = this.counter + 1;

        res(fileSaver.saveAs(blob, this.imageName));
      }).then(async res=>
        {
          await this.delay(5000);
          this.verifyEmployee(this.imageName);
        });  
      //this.verifyEmployee(imageFile);
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  verifyEmployee(image)
  {
    this.data.verifyUser(image).subscribe(data => {
      if(data['success'] == "False")
      {
        this.message = "Error! Face was not recognized";
        this.valid=false;
      }
      else
      {
        this.message = "Welcome to the meeting " + data['Title']+ ". "+data['Surname'];
        this.valid = true;
      }        
    });
  }
}

/* //console.log(this.base64IMGTWO);
      
      var blob = new Blob([base64Img], {type: 'image/png'});
      const imageFile = new File([blob], 'demotest.png', { type: 'image/png' });
      // //console.log(imageFile);
    
      var data = new Blob([base64Img], {type: "text/plain;charset=utf-8"});
      fileSaver.saveAs(data, 'demotest.txt');
    //var js = (this.base64IMGTWO).toString();
       // console.log(js);*/