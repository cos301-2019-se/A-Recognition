import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FRComponent } from './fr.component';
import { HttpClient } from 'selenium-webdriver/http';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('FRComponent', () => {
  let component: FRComponent;
  let fixture: ComponentFixture<FRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FRComponent ],
      imports:[HttpClientModule,ReactiveFormsModule,FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
