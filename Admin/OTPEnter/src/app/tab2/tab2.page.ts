import { Component,OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { FormControl, FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService} from '../auth.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  scannedData: {};
  otpScan: FormGroup;
  public message: any = '';
  public valid: any;
  otpEntered: any;

  constructor(public qrScanner: QRScanner,private formBuilder: FormBuilder, public auth: AuthService,private alertController: AlertController){

  }
  ngOnInit()
  {
    this.otpScan = this.formBuilder.group(
      {
        otp: ['', [Validators.required]],
        scannedText: ['', [Validators.required]],
      });
  }
      /** 
 * Function Name:presentAlert
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: showcases the alerts
*/ 
async presentAlert() {
  const alert = await this.alertController.create({
    header: 'OTP Access',
    message: this.message,
    buttons: ['OK']
  });

  await alert.present();
}
  /** 
 * Function Name:scanCode
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: opens up qrscanner and scans code
 * then displays the code.
*/
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
    ionApp.style.display = 'block';
  }
  /** 
 * Function Name:validateOTP
 * Version: V3.5
 * Author: Richard McFadden
 * Funtional description: returns true or false
*/
  public validateOTP(otp: any)
  {
    console.log(otp, this.scannedData);
    this.otpEntered = otp;
    this.auth.validateOneTimePinByRoom(this.scannedData.toString() , otp).then( (data) =>
    {
      if(data == true){
        console.log(data);
        this.message = 'You are allowed access to the room now!';
        this.valid = true;
      }
      else if (data == false)
      {
        // tslint:disable-next-line: max-line-length
        this.message = 'Either the OTP entered is wrong, expired or you are not allowed in right now. The room scanned might also not exist.';
        this.valid = false;
      }
      this.presentAlert();
    }).catch( err =>
      {
        console.log('Error: ', err);
      });
  }
}
