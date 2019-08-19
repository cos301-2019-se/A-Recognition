import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { ReportsService } from '../reports.service';  
import { Reports } from '../reports/reports';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  allReports: object;
  dataSaved = false;  
  reportForm: any;  
  diseaseIdUpdate = null;  
  message = null;

  constructor(private formbulider: FormBuilder, private reportService:ReportsService) { }

  ngOnInit() {    
      this.reportForm = this.formbulider.group({  
      Search: ['', [Validators.required]],  
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
      this.allReports = this.reportService.searchReports(val);
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
