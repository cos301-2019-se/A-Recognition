
import { Component, OnInit,Renderer2 } from '@angular/core';
import {AuthService} from '../auth.service';
import { Router } from  "@angular/router";
import { DatabaseService } from '../database.service';
import { FormGroup ,FormBuilder,Validators} from '@angular/forms';
import {PyDataService} from '../py-data.service';
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
  employee:FormGroup;
  submitted:boolean = true;
  bookRoom:FormGroup;
  imageName:String;

  constructor(private data:PyDataService, private authService:AuthService,private formBuilder: FormBuilder,public  router:  Router,private booking:DatabaseService,private renderer:Renderer2) { }

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
       this.employee = this.formBuilder.group({
        nameEmployee: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        title: ['', [Validators.required]],
        image: ['', [Validators.required]]
       });

       //Get all info in the collection
       this.populateList();
    }    
  }
  onSubmit()
  {
    this.submitted = true;
    //this.addBoardRoom(name);
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
    //console.log(deviceValue);
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
  btnClick= function () {
    this.router.navigateByUrl('/fr');
  };
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
      //console.log(data);
    });    
  }
  //NEW STUFF **************************
  fileEvent(fileInput: any){
    let file = fileInput.target.files[0];
    let fileName = file.name;
    this.imageName = fileName;
}

  addEmployee(nameEmployee,surname,title)
  {
    this.data.RegisterUser(nameEmployee,surname,title,this.imageName).subscribe(data => {
      
    });
  }
  
//*********************************** */

}
