import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculateShipping(): number {
    // Basic shipping calculation
    const baseShipping = 5;
    const itemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    return baseShipping + (itemCount > 1 ? (itemCount - 1) * 2 : 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateShipping();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
