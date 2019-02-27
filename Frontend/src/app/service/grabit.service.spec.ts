import { TestBed } from '@angular/core/testing';

import { GrabitService } from './grabit.service';

describe('GrabitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrabitService = TestBed.get(GrabitService);
    expect(service).toBeTruthy();
  });
});
