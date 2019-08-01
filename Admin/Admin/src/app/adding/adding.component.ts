import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import {ImageService} from '../image.service';
@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.css']
})

export class AddingComponent implements OnInit 
{
  @ViewChild('video', {static: false})
    public video: ElementRef;

  @ViewChild('canvas', {static: false})
  public canvas: ElementRef;

  public captures: Array<any>;

  constructor(private imageService: ImageService) 
  { 
    this.captures = [];
  }

  ngOnInit() 
  {
  }
/** 
 * Function Name:processFile
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: this is where the data is processed which
 * needs to be send to the central interface for registration
*/
  processFile($event,name,surname,title,email) 
  {
      const file: File = $event.files[0];
      const formData: FormData = new FormData();
      formData.append('image', file);
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('email', email);
      formData.append('title', title);
      
      this.imageService.uploadImage(formData).subscribe(res =>
      {
        console.log(res);
        if (res === true)
        {
          window.location.reload();
        }
      });
  }
  /** 
 * Function Name:whenPressed
 * Version: V1.0
 * Author: Richard McFadden
 * Funtional description: Activates the webcam when the respective modal is 
 * opened
*/
  public whenPressed() 
  {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this.video.nativeElement.srcObject = stream; // window.URL.createObjectURL(stream);
            this.video.nativeElement.play();
        });
    }
  }
/** 
 * Function Name:Capture
 * Version: V3.0
 * Author: Richard McFadden
 * Funtional description: Almost like processFile 
 * But This function has to do a lot more processing 
 * Gets in all the text based info and an canvas.
*/
  public capture(name,surname,title,email) 
  {
    const img = this.canvas.nativeElement.toDataURL('image/jpeg',0.5);

    // const formData : FormData = new FormData();
    // formData.append('image', img);
    // formData.append('name', name);
    // formData.append('surname', surname);
    // formData.append('email', email);
    // formData.append('title', title);

    this.imageService.uploadImageTaken(img, name, surname, title, email).subscribe( res =>
    {
      
    });
  }
}
