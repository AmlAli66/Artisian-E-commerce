import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-order-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-order-request.component.html',
  styleUrl: './custom-order-request.component.scss'
})
export class CustomOrderRequestComponent {
  selectedColor = '#DD9E92'; // Default color

  orderForm: FormGroup;
  submitted = false;

  scents = ['Lavender', 'Vanilla', 'Rose', 'Citrus', 'Cinnamon'];
  shapes = ['Round', 'Heart', 'Star', 'Square'];
  colors = ['Red', 'White', 'Purple', 'Yellow', 'Blue'];

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      scent: ['', Validators.required],
      shape: ['', Validators.required],
      color: ['', Validators.required],
      notes: ['']
    });
  }

  submitForm() {
    if (this.orderForm.valid) {
      console.log('Custom Order Submitted:', this.orderForm.value);
      this.submitted = true;
      this.orderForm.reset();
    }
  }
}
