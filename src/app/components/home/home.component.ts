import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/interfaces/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {
    // this.products = this.productService.getLatestProducts();
  }




  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
