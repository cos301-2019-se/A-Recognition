
import { Component, OnInit,Renderer2 } from '@angular/core';
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

  list:Array<any>;
  expandedList: Object;
  expandedArray:any=[];
  dateTime:any=[];
  boardRoom:FormGroup;
  bookRoom:FormGroup;
  constructor(private authService:AuthService,private formBuilder: FormBuilder,public  router:  Router,private booking:DatabaseService,private renderer:Renderer2) { }

  ngOnInit() {
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
  onChange(deviceValue) {
    console.log(deviceValue);
    this.booking.getRoomsByName().subscribe((data)=>
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
  // getDates()
  // {
  //   this.expandedArray.forEach((x)=>
  //   {
  //     this.dateTime.push([x['bookings']['date'],x['bookings']['time']]  );
  //     console.log(this.dateTime);
  //   });
  // }
  populateList()
  {
    this.booking.getRooms().subscribe((data) =>
    {
      this.list = data;
      console.log(data);
    });
    
  }

}
