import { TestBed, async, inject } from '@angular/core/testing';

import { SignupLoginGuard } from './signup-login.guard';

describe('SignupLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignupLoginGuard]
    });
  });

  it('should ...', inject([SignupLoginGuard], (guard: SignupLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
