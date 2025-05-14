import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  id: string | number;
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
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private readonly CART_STORAGE_KEY = 'artisan_marketplace_cart';
  private readonly MAX_QUANTITY = 10; // Maximum quantity per item

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart data
        if (Array.isArray(parsedCart) && this.validateCartItems(parsedCart)) {
          this.cartItems.next(parsedCart);
        } else {
          console.warn('Invalid cart data found in localStorage. Starting with empty cart.');
          this.clearCart();
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      this.clearCart();
    }
  }

  private validateCartItems(items: any[]): boolean {
    return items.every(item => 
      item.id && 
      item.name && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number' &&
      Array.isArray(item.images)
    );
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartItems.pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
  }

  addToCart(item: Partial<CartItem>): void {
    try {
      if (!item.id || !item.name || !item.price) {
        throw new Error('Invalid item data');
      }

      const currentItems = this.cartItems.value;
      const existingItem = currentItems.find(i => i.id === item.id);

      if (existingItem) {
        const newQuantity = (existingItem.quantity + (item.quantity || 1));
        if (newQuantity <= this.MAX_QUANTITY) {
          existingItem.quantity = newQuantity;
          this.cartItems.next([...currentItems]);
        } else {
          console.warn(`Cannot add more than ${this.MAX_QUANTITY} items of the same product`);
        }
      } else {
        const newItem: CartItem = {
          ...item,
          quantity: Math.min(item.quantity || 1, this.MAX_QUANTITY),
          description: item.description || '',
          images: item.images || []
        } as CartItem;
        this.cartItems.next([...currentItems, newItem]);
      }

      this.saveCart();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  }

  updateQuantity(itemId: string | number, quantity: number): void {
    try {
      if (quantity < 1 || quantity > this.MAX_QUANTITY) {
        throw new Error(`Quantity must be between 1 and ${this.MAX_QUANTITY}`);
      }

      const currentItems = this.cartItems.value;
      const itemIndex = currentItems.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }

      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], quantity };
      this.cartItems.next(updatedItems);
      this.saveCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  removeFromCart(itemId: string | number): void {
    try {
      const currentItems = this.cartItems.value;
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      this.cartItems.next(updatedItems);
      this.saveCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart();
  }

  isItemInCart(itemId: string | number): boolean {
    return this.cartItems.value.some(item => item.id === itemId);
  }

  getItemQuantity(itemId: string | number): number {
    const item = this.cartItems.value.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  }

  private saveCart(): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems.value));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }
} 