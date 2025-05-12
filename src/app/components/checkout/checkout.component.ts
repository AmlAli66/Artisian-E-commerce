import { Component, computed, inject, OnDestroy } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  fb = inject(FormBuilder);

  cartItems = computed(() => this.cartService.getItems());
  total = computed(() => this.cartService.getTotalPrice());

  checkoutForm: FormGroup;
  submitted = false;

  constructor() {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  placeOrder() {
    if (this.checkoutForm.valid) {
      console.log('Order Placed:', {
        customerInfo: this.checkoutForm.value,
        items: this.cartItems(),
        total: this.total()
      });

      this.cartService.clearCart();
      this.submitted = true;
    }
  }
}
