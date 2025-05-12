import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: any[] = [];

  getItems() {
    return this.cartItems;
  }

  addToCart(item: any) {
    const existing = this.cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(i => i.id !== id);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clearCart() {
    this.cartItems = [];
  }
}
