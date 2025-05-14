import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  loading = new BehaviorSubject<boolean>(true);
  error = new BehaviorSubject<string | null>(null);
  private cartSubscription: Subscription;
  readonly TAX_RATE = 0.08; // 8% tax rate

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartSubscription = this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.loading.next(false);
        this.error.next(null);
      },
      error: (err) => {
        console.error('Error loading cart items:', err);
        this.error.next('Failed to load cart items. Please try refreshing the page.');
        this.loading.next(false);
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  increaseQuantity(item: CartItem): void {
    try {
      this.cartService.updateQuantity(item.id, item.quantity + 1);
    } catch (error) {
      console.error('Error increasing quantity:', error);
      this.error.next('Failed to update quantity. Please try again.');
    }
  }

  decreaseQuantity(item: CartItem): void {
    try {
      if (item.quantity > 1) {
        this.cartService.updateQuantity(item.id, item.quantity - 1);
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      this.error.next('Failed to update quantity. Please try again.');
    }
  }

  removeItem(item: CartItem): void {
    try {
      if (confirm('Are you sure you want to remove this item from your cart?')) {
        this.cartService.removeFromCart(item.id);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      this.error.next('Failed to remove item. Please try again.');
    }
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * this.TAX_RATE;
  }

  calculateShipping(): number {
    const baseShipping = 5;
    const itemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    const weightFactor = this.calculateWeightFactor();
    return baseShipping + (itemCount > 1 ? (itemCount - 1) * 2 : 0) + weightFactor;
  }

  private calculateWeightFactor(): number {
    // Calculate additional shipping based on candle sizes
    return this.cartItems.reduce((factor, item) => {
      if (item.customOrder) {
        switch (item.customOrder.size.toLowerCase()) {
          case 'large':
            return factor + 3 * item.quantity;
          case 'medium':
            return factor + 2 * item.quantity;
          default:
            return factor + item.quantity;
        }
      }
      return factor;
    }, 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateShipping() + this.calculateTax();
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  getItemImage(item: CartItem): string {
    try {
      return item.images[0] || '/assets/images/placeholder.jpg';
    } catch {
      return '/assets/images/placeholder.jpg';
    }
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.error.next('Your cart is empty. Add some items before checking out.');
      return;
    }

    try {
      // Navigate to checkout
      this.router.navigate(['/checkout']);
    } catch (error) {
      console.error('Error navigating to checkout:', error);
      this.error.next('Failed to proceed to checkout. Please try again.');
    }
  }

  clearError(): void {
    this.error.next(null);
  }
}
