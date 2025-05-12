import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderRequestComponent } from './custom-order-request.component';

describe('CustomOrderRequestComponent', () => {
  let component: CustomOrderRequestComponent;
  let fixture: ComponentFixture<CustomOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomOrderRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
