import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth.service';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public auth: AuthService)
  { 

  }
  editEmployees: FormGroup;
  message: any;
  valid: any;
  employeeList: any;
  ngOnInit() 
  {
    this.editEmployees = this.formBuilder.group(
    {
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
    
    this.auth.getEmployees().subscribe((data)=>
    {
      this.employeeList = data;
    });
  }

}
