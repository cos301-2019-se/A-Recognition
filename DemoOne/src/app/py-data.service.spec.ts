import { TestBed } from '@angular/core/testing';

import { PyDataService } from './py-data.service';
import {HttpClientModule} from '@angular/common/http';
describe('PyDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientModule]
  }));

  it('should be created', () => {
    const service: PyDataService = TestBed.get(PyDataService);
    expect(service).toBeTruthy();
  });
});
