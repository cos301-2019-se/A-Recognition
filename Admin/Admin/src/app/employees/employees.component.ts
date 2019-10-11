import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth.service';
import {ImageService} from '../image.service';
import {Subject, Observable} from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public auth: AuthService,public imageService: ImageService)
  { 

  }
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
  editEmployees: FormGroup;
  message: any;
  valid: any;
  employeeList: any;
  ngOnInit() 
  {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    this.editEmployees = this.formBuilder.group(
    {
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
    
    this.auth.getEmployees().subscribe((data) =>
    {
      this.employeeList = data;
      console.log(data);
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
public handleImage(webcamImage: WebcamImage,title ,name,surname,email): void {
  console.info('received webcam image', webcamImage);
  this.webcamImage = webcamImage;
  let temp = this.webcamImage.imageAsDataUrl;
  let tempTwo:Blob = this.dataURItoBlob(temp);
  const imageFile = new File([tempTwo], name, { type: 'image/jpeg' });

  this.imageService.updatingEmployee(imageFile, title,name, surname, email).subscribe( res =>
  {
    if (res == true)
    {
      this.message = 'User Updated.';
      this.valid = true;
    }
    else{
      this.message = 'An error occured during the updating process.';
      this.valid = false;
    }
  });
}
/** 
* Function Name:handleImage
* Version: V3.5
* Author: Richard McFadden
* Funtional description:gets the imagedata and sends it along
*/
public handleWithoutImage(title, name, surname, email): void {

  this.imageService.updatingEmployeeWithout(title, name, surname, email).subscribe( res =>
  {
    if (res == true)
    {
      this.message = 'User Updated.';
      this.valid = true;
    }
    else{
      this.message = 'An error occured during the updating process.';
      this.valid = false;
    }
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
