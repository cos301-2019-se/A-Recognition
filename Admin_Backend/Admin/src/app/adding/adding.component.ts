import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import {ImageService} from '../image.service';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.css']
})

export class AddingComponent implements OnInit 
{
  public showWebcam = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  constructor(private imageService: ImageService) 
  { 
   
  }

  ngOnInit() 
  {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  /** 
 * Function Name:triggerSnapshot
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: triggers the event that takes the photo
*/
  public triggerSnapshot(): void {
    this.trigger.next();
  }
/** 
 * Function Name:toggleWbecam
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: show or hide the webcam
*/
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
/** 
 * Function Name:handleInitError
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: prints out errors that occur during execution
*/
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  /** 
 * Function Name:handleImage
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description:gets the imagedata and sends it along
*/
  public handleImage(webcamImage: WebcamImage,name,surname,title,email): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    let temp = this.webcamImage.imageAsDataUrl;
    let tempTwo:Blob = this.dataURItoBlob(temp);
    const imageFile = new File([tempTwo], name, { type: 'image/jpeg' });

    this.imageService.uploadImageTaken(imageFile,name,surname,title,email).subscribe( res =>
    {
         
    });
  }
    /** 
 * Function Name:dataURItoBlob
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description:takes a uri and transforms it into a blob to be
 * saved as a file
*/
  public dataURItoBlob(dataURI)
  {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
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
 * Function Name:close
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: Just reloads the page.
*/
  public close()
  {
    window.location.reload();
  }
}
