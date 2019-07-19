import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoginService} from '../login/login.service';
import { Employee } from '../employee'; 

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    allEmployees: object;
    loading = false;
    submitted = false;
    returnUrl: string;
    message: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService,
        //private alertService: AlertService
    ) {

    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            Email: ['', Validators.required],
            Password: ['', Validators.required],
            Name: ['', [Validators.required]],  
            Surname: ['', [Validators.required]],  
      EmpPosition: ['', [Validators.required]],  
        });

        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.allEmployees = this.loginService.getEmployees();
        const emp = this.loginForm.value;
        this.sendEmployee(emp);
        //this.f.username.setValue(this.emp[0]);
        console.log(this.f.Email.value);
        //console.log(this.loginService.searchEmployee(this.f.username.value, this.f.password.value));
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        /*this.loginService.searchEmployee(this.f.username.value)//, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    this.router.navigate(['admin']);
                },
                error => {
                    console.log("Fail");
                    //this.alertService.error(error);
                    this.loading = false;
                });*/
    }
    sendEmployee(emp: Employee) {   
          this.loginService.searchEmployee(emp).subscribe(  
            data => {  
                console.log(data);
                if(data!=null)
                {   
                    this.router.navigate(['admin']);
                }
                else
                {
                    this.message = "Incorrect details entered";
                }
            },
            error => {
                console.log("Failed");
            }  
          ); 
        }
}
