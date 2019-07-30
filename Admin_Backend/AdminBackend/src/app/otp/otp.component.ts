import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { OtpService } from '../otp/otp.service';  
import { Employee } from '../employee'; 

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  allEmployees: object;
  dataSaved = false;  
  otpForm: any;  
  adminIdUpdate = null;  
  message = null;
  public imagePath;a
  imgURL: any;
  public message2: string;

  constructor(private formbulider: FormBuilder, private otpService:OtpService) { }

  ngOnInit() {    
      this.otpForm = this.formbulider.group({  
      Name: ['', [Validators.required]],  
      Surname: ['', [Validators.required]],  
      Email: ['', [Validators.required]], 
    });  
    }  
    
    onFormSubmit() {  
      this.dataSaved = false;  
      const emp = this.otpForm.value;  
      this.CreateEmployee(emp);  
      this.otpForm.reset();  
    }    
    
    CreateEmployee(emp: Employee) {  
      if (this.adminIdUpdate == null) { 
        if(emp.Email==""||emp.Name==""||emp.Surname=="")
        {
          this.message = 'Record not saved because of missing information';
        }
        else{ 
        this.otpService.addOTP(emp).subscribe(  
          () => {  
            this.dataSaved = true;  
            this.message = 'Record saved Successfully';    
            this.adminIdUpdate = null;  
            this.otpForm.reset();  
          }  
        );  }
      } else {  
        /*emp.EmployeeID = this.adminIdUpdate;  
        this.otpService.updateEmployee(emp).subscribe(() => {  
          this.dataSaved = true;  
          this.message = 'Record Updated Successfully';  
          this.loadAllEmployees();  
          this.adminIdUpdate = null;  
          this.otpForm.reset();  
        }); */ 
      }  
    }   
    resetForm() {  
      this.otpForm.reset();  
      this.message = null;  
      this.dataSaved = false;  
    }

}
