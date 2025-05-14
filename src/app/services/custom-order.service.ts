import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartService } from './cart.service';

export interface CustomCandle {
  shape: string;
  size: string;
  color: string;
  scentPrimary: string;
  scentSecondary?: string;
  scentIntensity: number;
  container: string;
  label?: string;
  message?: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {
  private customOrdersSubject = new BehaviorSubject<CustomCandle[]>([]);
  customOrders$ = this.customOrdersSubject.asObservable();

  constructor(private cartService: CartService) {}

  addCustomOrder(order: CustomCandle) {
    const currentOrders = this.customOrdersSubject.value;
    this.customOrdersSubject.next([...currentOrders, order]);

    // Add to cart as a special item
    this.cartService.addToCart({
      id: `custom-${Date.now()}`,
      name: 'Custom Candle',
      price: order.price,
      description: this.generateDescription(order),
      images: ['/assets/images/custom-candle-placeholder.jpg'],
      quantity: 1,
      customOrder: order
    });
  }

  private generateDescription(order: CustomCandle): string {
    const details = [
      `Shape: ${order.shape}`,
      `Size: ${order.size}`,
      `Scent: ${order.scentPrimary} (Intensity: ${order.scentIntensity}/5)`,
      `Container: ${order.container}`
    ];

    if (order.message) {
      details.push(`Custom Message: "${order.message}"`);
    }

    return details.join(' | ');
  }

  getCustomOrders(): Observable<CustomCandle[]> {
    return this.customOrders$;
  }
} 