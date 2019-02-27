import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigningoutComponent } from './signingout.component';

describe('SigningoutComponent', () => {
  let component: SigningoutComponent;
  let fixture: ComponentFixture<SigningoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigningoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigningoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
