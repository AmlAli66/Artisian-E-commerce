import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartService } from './cart.service';

export interface CustomCandle {
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
}

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {
  private customOrdersSubject = new BehaviorSubject<CustomCandle[]>([]);
  customOrders$ = this.customOrdersSubject.asObservable();
  private readonly STORAGE_KEY = 'artisan_marketplace_custom_orders';

  constructor(private cartService: CartService) {
    this.loadCustomOrders();
  }

  private loadCustomOrders(): void {
    try {
      const savedOrders = localStorage.getItem(this.STORAGE_KEY);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders) && this.validateCustomOrders(parsedOrders)) {
          this.customOrdersSubject.next(parsedOrders);
        }
      }
    } catch (error) {
      console.error('Error loading custom orders:', error);
      this.customOrdersSubject.next([]);
    }
  }

  private validateCustomOrders(orders: any[]): boolean {
    return orders.every(order => 
      order.type && 
      (order.type === 'direct' || order.type === 'container') &&
      order.size &&
      order.color &&
      order.scentPrimary &&
      typeof order.scentIntensity === 'number' &&
      typeof order.price === 'number' &&
      ((order.type === 'direct' && order.shape) || 
       (order.type === 'container' && order.container))
    );
  }

  addCustomOrder(order: CustomCandle): void {
    try {
      // Validate the order
      if (!this.validateCustomOrder(order)) {
        throw new Error('Invalid custom order data');
      }

      const currentOrders = this.customOrdersSubject.value;
      this.customOrdersSubject.next([...currentOrders, order]);
      this.saveCustomOrders();

      // Add to cart as a special item
      this.cartService.addToCart({
        id: `custom-${Date.now()}`,
        name: this.generateName(order),
        price: order.price,
        description: this.generateDescription(order),
        images: [this.getCustomCandleImage(order)],
        quantity: 1,
        customOrder: order
      });
    } catch (error) {
      console.error('Error adding custom order:', error);
      throw error;
    }
  }

  private validateCustomOrder(order: CustomCandle): boolean {
    if (!order.type || !['direct', 'container'].includes(order.type)) {
      return false;
    }

    if (order.type === 'direct' && !order.shape) {
      return false;
    }

    if (order.type === 'container' && !order.container) {
      return false;
    }

    return !!(
      order.size &&
      order.color &&
      order.scentPrimary &&
      typeof order.scentIntensity === 'number' &&
      order.scentIntensity >= 1 &&
      order.scentIntensity <= 5 &&
      typeof order.price === 'number' &&
      order.price > 0
    );
  }

  private generateName(order: CustomCandle): string {
    const type = order.type === 'direct' ? 'Shape' : 'Container';
    const detail = order.type === 'direct' ? order.shape : order.container;
    return `Custom ${type} Candle - ${detail}`;
  }

  private getCustomCandleImage(order: CustomCandle): string {
    try {
      if (order.type === 'direct') {
        return `/assets/images/shapes/${order.shape}.jpg`;
      } else {
        return `/assets/images/containers/${order.container}.jpg`;
      }
    } catch (error) {
      console.error('Error getting custom candle image:', error);
      return '/assets/images/placeholder.jpg';
    }
  }

  private generateDescription(order: CustomCandle): string {
    try {
      const details = [
        order.type === 'direct' ? `Shape: ${order.shape}` : `Container: ${order.container}`,
        `Size: ${order.size}`,
        `Color: ${order.color}`,
        `Scent: ${order.scentPrimary} (Intensity: ${order.scentIntensity}/5)`
      ];

      if (order.message) {
        details.push(`Message: "${order.message}"${order.font ? ` (${order.font})` : ''}`);
      }

      return details.join(' | ');
    } catch (error) {
      console.error('Error generating description:', error);
      return 'Custom Candle';
    }
  }

  getCustomOrders(): Observable<CustomCandle[]> {
    return this.customOrders$;
  }

  private saveCustomOrders(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.customOrdersSubject.value));
    } catch (error) {
      console.error('Error saving custom orders:', error);
    }
  }
} 