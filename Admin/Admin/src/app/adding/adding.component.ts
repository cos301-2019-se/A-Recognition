import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import {ImageService} from '../image.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.css']
})

export class AddingComponent implements OnInit 
{
  uploader: FileUploader = new FileUploader({ url: 'http://localhost:2999/add', itemAlias: 'photo' });
  selectedFile: ImageSnippet;
  @ViewChild('video', {static: false})
    public video: ElementRef;

  @ViewChild('canvas', {static: false})
  public canvas: ElementRef;

  public captures: Array<any>;
  public base64textString:any;
  constructor(private imageService: ImageService) 
  { 
    this.captures = [];
  }

  ngOnInit() 
  {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        console.log('ImageUpload:uploaded:', item, status, response);
        alert('File uploaded successfully');
    };
  }

  processFile($event) 
  {
//     const file: File = $event.target.files[0];
//     const reader = new FileReader();
//     // reader.onload =this._handleReaderLoaded.bind(this);
//     reader.addEventListener('load', (event: any) => {

// //this.selectedFile = new ImageSnippet(event.target.result, file);

//       const image = reader.result;
//       this.imageService.uploadImage(image).subscribe(
//         (res) => {
//           console.log(res);
//         },
//         (err) => {
//           console.log(err);
//         });
//     });

//     reader.readAsDataURL(file);
    
    

  }

  // public _handleReaderLoaded(readerEvt) {
  //   var binaryString = readerEvt.target.result;
  //   this.base64textString= btoa(binaryString);
  //   console.log(btoa(binaryString));
  // }

  public ngAfterViewInit() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this.video.nativeElement.srcObject = stream; // window.URL.createObjectURL(stream);
            this.video.nativeElement.play();
        });
    }
  }

  public capture() {
      var context = this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
      this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
      // TODO 
      // Maybe this works we will have to wait till the api is up 
      this.processFile(this.captures[0]);
  }

}


class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
