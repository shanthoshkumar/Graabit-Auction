import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyexpireddealsComponent } from './myexpireddeals.component';

describe('MyexpireddealsComponent', () => {
  let component: MyexpireddealsComponent;
  let fixture: ComponentFixture<MyexpireddealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyexpireddealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyexpireddealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
