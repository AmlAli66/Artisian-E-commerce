import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ArtistService } from '../../core/services/artist.service';
import { PRODUCTS } from '../../data/products';
import { ARTISTS } from '../../data/artists';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  // constructor(

  //   private cartService: CartService,
  // ) { }

  // private route = inject(ActivatedRoute);
  // product: any;
  // artist: any;

  // ngOnInit() {
  //   const id = Number(this.route.snapshot.paramMap.get('id'));
  //   this.product = PRODUCTS.find(p => p.id === id);

  //   if (this.product) {
  //     this.artist = ARTISTS.find(a => a.id === this.product.artistId);
  //   }
  // }

  // addToCart() {
  //   this.cartService.addToCart(this.product);
  //   alert('Added to cart!');
  // }

  product: any;
  artist: any;

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private artistService = inject(ArtistService);
  private cartService = inject(CartService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(prod => {
      this.product = prod;

      const artistId = prod?.artistId;
      if (artistId !== undefined) {
        this.artistService.getArtistById(artistId).subscribe(artist => {
          this.artist = artist;
        });
      }
    });


  }

  addToCart() {
    this.cartService.addToCart(this.product);
    alert(`${this.product.name} has been added to your cart!`);
  }

}
