import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  description: string;
  images: string[];
  quantity: number;
  customOrder?: {
    type: 'direct' | 'container';
    shape: string;
    size: string;
    color: string;
    scentPrimary: string;
    scentIntensity: number;
    container?: string;
    message?: string;
    font?: string;
    price: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'artisan_cart';
  private readonly MAX_QUANTITY = 99;
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems.next([]);
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems.value));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCurrentCart(): CartItem[] {
    return this.cartItems.value;
  }

  addToCart(item: Partial<CartItem>): void {
    if (!this.validateItem(item)) {
      throw new Error('Invalid item data');
    }

    try {
      const currentItems = this.cartItems.value;
      const existingItem = currentItems.find(i => i.id === item.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + (item.quantity || 1);
        if (newQuantity <= this.MAX_QUANTITY) {
          existingItem.quantity = newQuantity;
          this.cartItems.next([...currentItems]);
        } else {
          throw new Error(`Cannot add more than ${this.MAX_QUANTITY} items of the same product`);
        }
      } else {
        const newItem: CartItem = {
          id: item.id!,
          name: item.name!,
          price: item.price!,
          description: item.description || '',
          images: item.images || [],
          quantity: Math.min(item.quantity || 1, this.MAX_QUANTITY),
          customOrder: item.customOrder
        };
        this.cartItems.next([...currentItems, newItem]);
      }

      this.saveCart();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  updateQuantity(itemId: number | string, quantity: number): void {
    if (quantity < 1 || quantity > this.MAX_QUANTITY) {
      throw new Error(`Quantity must be between 1 and ${this.MAX_QUANTITY}`);
    }

    try {
      const currentItems = this.cartItems.value;
      const item = currentItems.find(i => i.id === itemId);
      
      if (item) {
        item.quantity = quantity;
        this.cartItems.next([...currentItems]);
        this.saveCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  removeFromCart(itemId: number | string): void {
    try {
      const currentItems = this.cartItems.value;
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      this.cartItems.next(updatedItems);
      this.saveCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  clearCart(): void {
    try {
      this.cartItems.next([]);
      this.saveCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  private validateItem(item: Partial<CartItem>): boolean {
    return !!(
      item.id !== undefined && 
      item.name && 
      typeof item.price === 'number' && 
      item.price >= 0
    );
  }
} 