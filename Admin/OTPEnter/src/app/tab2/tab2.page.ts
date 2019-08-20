import { Component,OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  scannedData: {};
  constructor(public qrScanner: QRScanner){

  }
  ngOnInit()
  {
  }

  scanCode()
  {
    let ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted
       // start scanning 
       ionApp.style.display = 'none';
       this.qrScanner.show();
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);
         this.scannedData = text;
        
         this.qrScanner.hide(); // hide camera preview
         ionApp.style.display = 'block';
         scanSub.unsubscribe(); // stop scanning
       });

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
       this.qrScanner.openSettings();
       ionApp.style.display = 'block';
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
       console.log("Permissions were denied.");
     }
  })
  .catch((e: any) => console.log('Error is', e));
    //this.hideCamera();
    ionApp.style.display = 'block';
  }
  

}
