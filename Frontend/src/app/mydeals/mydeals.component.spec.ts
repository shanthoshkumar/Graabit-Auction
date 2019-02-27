import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydealsComponent } from './mydeals.component';

describe('MydealsComponent', () => {
  let component: MydealsComponent;
  let fixture: ComponentFixture<MydealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
