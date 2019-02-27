import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationdetailsComponent } from './registrationdetails.component';

describe('RegistrationdetailsComponent', () => {
  let component: RegistrationdetailsComponent;
  let fixture: ComponentFixture<RegistrationdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
