import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { AuthService} from '../auth.service';
// import { ChecklistModel } from '../checklist-model';
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
}
