import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbodetailsComponent } from './abodetails.component';

describe('AbodetailsComponent', () => {
  let component: AbodetailsComponent;
  let fixture: ComponentFixture<AbodetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbodetailsComponent]
    });
    fixture = TestBed.createComponent(AbodetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
