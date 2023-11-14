import { TestBed } from '@angular/core/testing';

import { ProblemsService } from './problems.service';

describe('ProblemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProblemsService = TestBed.get(ProblemsService);
    expect(service).toBeTruthy();
  });
});
