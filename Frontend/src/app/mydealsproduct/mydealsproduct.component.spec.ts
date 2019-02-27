import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydealsproductComponent } from './mydealsproduct.component';

describe('MydealsproductComponent', () => {
  let component: MydealsproductComponent;
  let fixture: ComponentFixture<MydealsproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydealsproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydealsproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
