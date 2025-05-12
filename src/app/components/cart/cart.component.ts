import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  items: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotalPrice();
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotalPrice();

  }
}
