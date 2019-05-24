import { TestBed } from '@angular/core/testing';

import { PyDataService } from './py-data.service';

describe('PyDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PyDataService = TestBed.get(PyDataService);
    expect(service).toBeTruthy();
  });
});
