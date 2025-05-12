import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/interfaces/product';
import { ArtistService } from '../../core/services/artist.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  displayedProducts: any[] = [];
  searchQuery: string = '';
  sortOption: string = 'priceAsc';

  constructor(
    private productService: ProductService,
    private _ArtistService: ArtistService,
    private cartService: CartService
  ) { }

  products: Product[] = [];



  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.displayedProducts = [...this.products];
      this.onSort();
    });

  }


  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  }

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.displayedProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    } else {
      this.displayedProducts = [...this.products];
    }
    this.onSort(); // Re-sort after search
  }

  onSort() {
    switch (this.sortOption) {
      case 'priceAsc':
        this.displayedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.displayedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        this.displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        this.displayedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
  }

}
