import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FRComponent } from './fr.component';

describe('FRComponent', () => {
  let component: FRComponent;
  let fixture: ComponentFixture<FRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FRComponent ]
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
