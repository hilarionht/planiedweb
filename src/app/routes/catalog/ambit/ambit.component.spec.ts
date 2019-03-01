import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbitComponent } from './ambit.component';

describe('AmbitComponent', () => {
  let component: AmbitComponent;
  let fixture: ComponentFixture<AmbitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
