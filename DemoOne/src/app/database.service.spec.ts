import { TestBed } from '@angular/core/testing';

import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import {AngularFireModule} from "@angular/fire";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule, AngularFireAuth} from "@angular/fire/auth";
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

import { DatabaseService } from './database.service';

//This is for connecting to firebase and using the authentication and login services
var config = {
  apiKey: "AIzaSyBZBjbJQEstJ1Qjx9bP8kIejypgXUsN1CM",
  authDomain: "capstoneusers-b474f.firebaseapp.com",
  databaseURL: "https://capstoneusers-b474f.firebaseio.com",
  projectId: "capstoneusers-b474f",
  storageBucket: "capstoneusers-b474f.appspot.com",
  messagingSenderId: "754403435763"
};
//

describe('DatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      AngularFireModule.initializeApp(config),
      AngularFireAuthModule,
      ReactiveFormsModule,
      AngularFirestoreModule,
      AngularFireDatabaseModule
      
    ],
    providers: [{provide:AngularFirestore},{provide:AngularFireAuth}],
  }));

  // it('should be created', () => {
  //   const service: DatabaseService = TestBed.get(DatabaseService);
  //   expect(service).toBeTruthy();
  // });
});
