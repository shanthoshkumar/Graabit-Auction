import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendcreditsComponent } from './sendcredits.component';

describe('SendcreditsComponent', () => {
  let component: SendcreditsComponent;
  let fixture: ComponentFixture<SendcreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendcreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendcreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
