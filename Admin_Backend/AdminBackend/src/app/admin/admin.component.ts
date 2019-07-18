import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { AdminService } from '../admin/admin.service';  
import { Employee } from '../employee';  

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  allEmployees: object;
  dataSaved = false;  
  adminForm: any;  
  adminIdUpdate = null;  
  message = null;
  public imagePath;
  imgURL: any;
  public message2: string;

  constructor(private formbulider: FormBuilder, private adminService:AdminService) { }

  ngOnInit() {    
      this.adminForm = this.formbulider.group({  
      Name: ['', [Validators.required]],  
      Surname: ['', [Validators.required]],  
      Email: ['', [Validators.required]],
      EmpPosition: ['', [Validators.required]],  
      Password: ['', [Validators.required]], 
    });
      this.loadAllEmployees();  
    }  
    loadAllEmployees() {  
      this.allEmployees = this.adminService.getAllEmployees();  
    } 
    
    onFormSubmit() {  
      this.dataSaved = false;  
      const emp = this.adminForm.value;  
      this.CreateEmployee(emp);  
      this.adminForm.reset();  
    }  
    loadEmployeeToEdit(emp: Employee) {  
      this.adminService.updateEmployee(emp).subscribe(()=> {  
        this.message = null;  
        this.dataSaved = false;    
        this.adminForm.controls['Name'].setValue(emp.Name);  
        this.adminForm.controls['Surname'].setValue(emp.Surname);  
        this.adminForm.controls['Email'].setValue(emp.Email);
        this.adminForm.controls['EmpPosition'].setValue(emp.EmpPosition);
        this.adminForm.controls['Password'].setValue(emp.Password);    
      });  
    
    }  
    CreateEmployee(emp: Employee) {  
      if (this.adminIdUpdate == null) { 
        if(emp.Email==""||emp.EmpPosition==""||emp.Name==""||emp.Password==""||emp.Surname=="")
        {
          this.message = 'Record not saved because of missing information';
        }
        else{ 
        this.adminService.addEmployee(emp).subscribe(  
          () => {  
            this.dataSaved = true;  
            this.message = 'Record saved Successfully';  
            this.loadAllEmployees();  
            this.adminIdUpdate = null;  
            this.adminForm.reset();  
          }  
        );  }
      } else {  
        emp.EmployeeID = this.adminIdUpdate;  
        this.adminService.updateEmployee(emp).subscribe(() => {  
          this.dataSaved = true;  
          this.message = 'Record Updated Successfully';  
          this.loadAllEmployees();  
          this.adminIdUpdate = null;  
          this.adminForm.reset();  
        });  
      }  
    }   
    deleteEmployee(email: string) {  
      if (confirm("Are you sure you want to delete this ?")) {   
      this.adminService.deleteEmployeeById(email).subscribe(() => {  
        this.dataSaved = true;  
        this.message = 'Record Deleted Succefully';  
        this.loadAllEmployees();  
        this.adminIdUpdate = null;  
        this.adminForm.reset();  
    
      });  
    }  
  }  
    resetForm() {  
      this.adminForm.reset();  
      this.message = null;  
      this.dataSaved = false;  
    }

    //upload image
 
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message2 = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

}
