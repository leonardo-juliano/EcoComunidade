import { TestBed } from '@angular/core/testing';

import { ToastrServiceService } from './toastr-service.service';

describe('ToastrServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastrServiceService = TestBed.get(ToastrServiceService);
    expect(service).toBeTruthy();
  });
});
