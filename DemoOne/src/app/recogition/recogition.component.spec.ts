import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecogitionComponent } from './recogition.component';

describe('RecogitionComponent', () => {
  let component: RecogitionComponent;
  let fixture: ComponentFixture<RecogitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecogitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecogitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
