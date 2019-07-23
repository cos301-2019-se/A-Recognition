import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import {ImageService} from '../image.service';
@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.css']
})

export class AddingComponent implements OnInit 
{

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

  processFile(imageInput: any) 
  {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
        },
        (err) => {
        });
    });

    reader.readAsDataURL(file);
  }

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
