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

  allReports: object;
  dataSaved = false;  
  reportForm: any;  
  diseaseIdUpdate = null;  
  message = null;

  ngOnInit() {    
      this.reportForm = this.formbulider.group({  
      Search: ['', [Validators.required]],  
      TimeVal: ['', [Validators.required]],
      DescriptionVal: ['', [Validators.required]]
    });
    this.loadAllReports();  
  }  
  loadAllReports() {  
    this.allReports = this.reportService.getAllReports();  
  } 
  
  onFormSubmit() {  
    this.dataSaved = false;  
    const value = this.reportForm.Search.value;  
    this.SearchReports(value);  
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
