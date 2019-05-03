import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import { Router } from  "@angular/router";
import { DatabaseService } from '../database.service';
import { FormGroup ,FormBuilder,Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Variables
  list:Array<any>;
  expandedList: Object;
  expandedArray:any=[];
  dateTime:any=[];
  boardRoom:FormGroup;
  submitted:boolean = true;
  bookRoom:FormGroup;
  //
  constructor(private authService:AuthService,private formBuilder: FormBuilder,public  router:  Router,private booking:DatabaseService){ }

  ngOnInit() 
  {
    if(!this.authService.isLoggedIn())
    {
      this.router.navigate(['login']);
    }
    else{
      this.boardRoom = this.formBuilder.group({
        name: ['', [Validators.required]],
        bookings: ['', [Validators.required]],
       });
       this.bookRoom = this.formBuilder.group({
        name: ['', [Validators.required]],
        time: ['', [Validators.required]],
        date:['', [Validators.required]]
       });

       //Get all info in the collection
       this.populateList();
    }    
  }
  onSubmit()
  {
    this.submitted = true;
  }
  addBoardRoom(name)
  {
    this.booking.BoardRoomRegistration(name);
  }
  makeBooking(name,date)
  {
    var d = date.split('T');
    this.booking.boardRoomBooking(name,d);
  }
  onChange(deviceValue) 
  {
    this.booking.getRoomsByName(deviceValue).subscribe((data)=>
    {
      data.docs.forEach((doc)=>
      {
        if(doc.id==deviceValue)
        {
          this.expandedArray=[];
          
          this.expandedList=(doc.data());
          this.expandedArray.push(this.expandedList); 
          console.log(this.expandedArray);
        }
      });
    });//,()=>{},()=>{this.getDates();}
  } 
  populateList()
  {
    this.booking.getRooms().subscribe((data) =>
    {
      this.list = data;
    });
  }

}
