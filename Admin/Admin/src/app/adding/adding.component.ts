import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import {ImageService} from '../image.service';
//import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.css']
})

export class AddingComponent implements OnInit 
{
  //uploader: FileUploader = new FileUploader({ url: 'http://localhost:2999/add', itemAlias: 'photo' });
  selectedFile: ImageSnippet;
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

  processFile($event,name,surname,title,email) 
  {
      const file: File = $event.files[0];
      let formData :FormData = new FormData();
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
        }     
      );
  }



  public whenPressed() 
  {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this.video.nativeElement.srcObject = stream; // window.URL.createObjectURL(stream);
            this.video.nativeElement.play();
        });
    }
  }

  public capture(name,surname,title,email) 
  {
    const flatten = this.canvas.nativeElement.getContext('2d');
    // var context = this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
    // this.captures.push(this.canvas.nativeElement.toDataURL('image/jpg'));
    // this.processFile(this.captures[0],name,surname,title,email);
    const img = this.canvas.nativeElement.toDataURL();
    const blob = new Blob([img], {type: 'image/jpeg'});
    const file = new File([blob], 'imageFileName.jpeg');
    const formData : FormData = new FormData();
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
      }     
    );
  }

}


class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
