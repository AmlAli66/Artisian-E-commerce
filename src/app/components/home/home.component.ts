import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/interfaces/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {
    // this.products = this.productService.getLatestProducts();
  }

  ngOnInit() {
    // Add any initialization logic here
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToCustomOrder() {
    this.router.navigate(['/custom-order']);
  }

  subscribeToNewsletter(email: string) {
    // Implement newsletter subscription logic
    console.log('Newsletter subscription for:', email);
    // You can add actual API call here
  }
}
