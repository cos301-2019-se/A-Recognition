import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { AuthService} from '../auth.service';
import { ChecklistModel } from '../checklist-model';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule
{ 
  public message: any = '';
  public eventList = new ChecklistModel('items',
  [{id: 1, name:'Superman'},
  {id: 2, name:'Batman'},
  {id: 5, name:'BatGirl'},
  {id: 3, name:'Robin'},
  {id: 4, name:'Flash'}
]);
  constructor(public auth: AuthService)
  { 
  //   this.auth.getList().then( (res) =>
  // {
  //   //console.log(res);
  //   //this.eventList = res;
  //   console.log(this.eventList);
   
  // });
  } 

  public validateOTP(eventid: any, otp: any)
  {
    this.auth.validateOneTimePin(eventid, otp).then( (data) =>
    {
      if(data == true){
        this.message = 'You are allowed access to the room now!';
      }
      else
      {
        this.message = 'Either the OTP entered is wrong, expired or you are not allowed in right now.';
      }
    });
  }
}
