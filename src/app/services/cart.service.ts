import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  description: string;
  images: string[];
  quantity: number;
  customOrder?: {
    shape: string;
    size: string;
    color: string;
    scentPrimary: string;
    scentIntensity: number;
    container: string;
    message?: string;
    label?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(item: Partial<CartItem>): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
      this.cartItems.next([...currentItems]);
    } else {
      const newItem: CartItem = {
        ...item,
        quantity: item.quantity || 1,
        description: item.description || '',
        images: item.images || []
      } as CartItem;
      this.cartItems.next([...currentItems, newItem]);
    }

    this.saveCart();
  }

  updateQuantity(itemId: string | number, quantity: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  removeFromCart(itemId: string | number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }
} 