import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { ReportsService } from '../reports.service';  
import { Reports } from '../reports';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(public formbulider: FormBuilder, public reportService:ReportsService) {

  }

  allReports: any;
  matchingReports: any;
  dataSaved = false;  
  reportForm: any;  
  diseaseIdUpdate = null;  
  message = null;

  ngOnInit() {    
      
    this.reportService.getAllReports().subscribe(res =>{
      this.allReports = res;

      this.allReports.forEach(report => {
        report.dateTime = new Date(report.date._seconds * 1000);    
      });
      this.matchingReports = this.allReports;
    });

    this.reportForm = this.formbulider.group({  
      // Search: ['', [Validators.required]],  
      // TimeVal: ['', [Validators.required]],
      // DescriptionVal: ['', [Validators.required]]
      report:['', [Validators.required]]
    });
  }  
  loadAllReports() {  
      
  } 
  
  search(searchTerm :string){
    searchTerm = searchTerm.toLowerCase();

    this.matchingReports = this.matchingReports.filter(report =>{
      if(report.user.toLowerCase().includes(searchTerm) || report.description.toLowerCase().includes(searchTerm) 
      || report.dateTime.toString().toLowerCase().includes(searchTerm) 
      || report.category.toLowerCase().includes(searchTerm))
        return true;
      else
        return false;
    }); 
    
  }

  undo(searchTerm :string){
    searchTerm = searchTerm.toLowerCase();

    console.log("Did a backspace");
    this.matchingReports = this.allReports.filter(report =>{
      if(report.user.toLowerCase().includes(searchTerm) || report.description.toLowerCase().includes(searchTerm) 
        || report.dateTime.toString().toLowerCase().includes(searchTerm)
        || report.category.toLowerCase().includes(searchTerm))
        return true;
      else
        return false;
    }); 
  }

  onFormSubmit() {  
    this.dataSaved = false;  
    //const value = this.reportForm.report.value;  
    console.log(this.reportForm);
    console.log(this.reportForm.report);
    
    //this.SearchReports(value);  
    //this.reportForm.reset();  
  }  

  SearchReports(val: string) {  
    this.allReports = this.reportService.searchReportsByTime(val);
    /*this.reportService.searchReports(val).subscribe(()=> {  
      this.message = null;  
      this.dataSaved = false;    
      this.reportForm.controls['Name'].setValue(data.Name);  
      this.reportForm.controls['Time'].setValue(data.Time);  
      this.reportForm.controls['Description'].setValue(val.Description); 
    });*/
  }  

  resetForm() {  
    this.reportForm.reset();  
    this.message = null;  
    this.dataSaved = false;  
  }

}
