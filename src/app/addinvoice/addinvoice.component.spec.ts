import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddinvoiceComponent } from './addinvoice.component';

describe('AddinvoiceComponent', () => {
  let component: AddinvoiceComponent;
  let fixture: ComponentFixture<AddinvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddinvoiceComponent]
    });
    fixture = TestBed.createComponent(AddinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
