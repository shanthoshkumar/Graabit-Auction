import { TestBed, async, inject } from '@angular/core/testing';

import { MydealsGuard } from './mydeals.guard';

describe('MydealsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MydealsGuard]
    });
  });

  it('should ...', inject([MydealsGuard], (guard: MydealsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
