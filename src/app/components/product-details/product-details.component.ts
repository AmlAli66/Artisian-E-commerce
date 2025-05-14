import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
  details: {
    burnTime: string;
    weight: string;
    scentNotes: string[];
    mood: string[];
  };
  images: string[];
  artistId: number;
  artistName: string;
  inStock: boolean;
  featured: boolean;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="product-details-container container py-5">
      <div class="row" *ngIf="product">
        <!-- Product Images -->
        <div class="col-lg-6">
          <div class="product-images">
            <div class="main-image">
              <img [src]="selectedImage || mainImage" [alt]="product.name" class="img-fluid">
            </div>
            <div class="image-thumbnails" *ngIf="product.images.length > 1">
              <div class="thumbnail" *ngFor="let img of product.images"
                   [class.active]="img === selectedImage"
                   (click)="selectImage(img)">
                <img [src]="img" [alt]="product.name + ' thumbnail'">
              </div>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="col-lg-6">
          <div class="product-info">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a routerLink="/products">Products</a></li>
                <li class="breadcrumb-item active">{{ product.name }}</li>
              </ol>
            </nav>

            <h1 class="product-title">{{ product.name }}</h1>
            
            <div class="artist-info" *ngIf="product.artistName">
              <div class="artist-details">
                <span class="artist-label">Artisan</span>
                <a [routerLink]="['/artist', product.artistId]" class="artist-name">
                  {{ product.artistName }}
                </a>
              </div>
            </div>

            <div class="product-price">\${{ product.price }}</div>
            
            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="product-details-list">
              <h3>Details</h3>
              <ul>
                <li><strong>Scent Notes:</strong> {{ product.details.scentNotes.join(', ') }}</li>
                <li><strong>Burn Time:</strong> {{ product.details.burnTime }}</li>
                <li><strong>Weight:</strong> {{ product.details.weight }}</li>
                <li><strong>Mood:</strong> {{ product.details.mood.join(', ') }}</li>
              </ul>
            </div>

            <div class="stock-status" [class.out-of-stock]="!product.inStock">
              <i class="fas" [class.fa-check-circle]="product.inStock" [class.fa-times-circle]="!product.inStock"></i>
              <span>{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</span>
            </div>

            <div class="product-actions">
              <div class="quantity-selector">
                <button class="btn btn-outline-secondary" 
                        (click)="decreaseQuantity()"
                        [disabled]="quantity <= 1 || !product.inStock">
                  <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="form-control" 
                       [(ngModel)]="quantity" 
                       [disabled]="!product.inStock"
                       min="1" max="99">
                <button class="btn btn-outline-secondary" 
                        (click)="increaseQuantity()"
                        [disabled]="quantity >= 99 || !product.inStock">
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <button class="btn btn-primary add-to-cart" 
                      (click)="addToCart()"
                      [disabled]="!product.inStock">
                <i class="fas fa-shopping-cart me-2"></i>
                {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
              </button>
            </div>

            <div class="product-meta">
              <div class="meta-item">
                <i class="fas fa-truck"></i>
                <span>Free shipping on orders over \$50</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-undo"></i>
                <span>30-day return policy</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-shield-alt"></i>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="!product">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-details-container {
      margin-top: 80px;
    }

    .product-images {
      .main-image {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;

        img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }
      }

      .image-thumbnails {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;

        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.3s ease;

          &:hover, &.active {
            opacity: 1;
            transform: translateY(-2px);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }

    .product-info {
      padding: 2rem;

      .breadcrumb {
        margin-bottom: 1.5rem;
        
        a {
          color: #8A9A5B;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }

      .product-title {
        font-family: 'Playfair Display', serif;
        font-size: 2.5rem;
        color: #36454F;
        margin-bottom: 1.5rem;
      }

      .artist-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .artist-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .artist-details {
          display: flex;
          flex-direction: column;

          .artist-label {
            font-size: 0.9rem;
            color: #666;
          }

          .artist-name {
            color: #8A9A5B;
            text-decoration: none;
            font-weight: 500;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .product-price {
        font-size: 2rem;
        font-weight: 600;
        color: #36454F;
        margin-bottom: 1.5rem;
      }

      .product-description {
        margin-bottom: 2rem;

        h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #36454F;
        }

        p {
          color: #666;
          line-height: 1.6;
        }
      }

      .product-details-list {
        margin-bottom: 2rem;

        h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #36454F;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            margin-bottom: 0.5rem;
            color: #666;

            strong {
              color: #36454F;
              margin-right: 0.5rem;
            }
          }
        }
      }

      .product-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          padding: 0.5rem;
          border-radius: 10px;

          .form-control {
            width: 60px;
            text-align: center;
            border: none;
            background: transparent;
            padding: 0;

            &:focus {
              box-shadow: none;
            }
          }

          button {
            width: 35px;
            height: 35px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .add-to-cart {
          flex-grow: 1;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
        }
      }

      .product-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #666;

          i {
            font-size: 1.2rem;
            color: #8A9A5B;
          }
        }
      }
    }

    @media (max-width: 991px) {
      .product-info {
        padding: 2rem 0;
      }

      .product-actions {
        flex-direction: column;

        .quantity-selector {
          width: 100%;
          justify-content: center;
        }
      }
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      color: #8A9A5B;
      font-weight: 500;

      &.out-of-stock {
        color: #dc3545;
      }

      i {
        font-size: 1.2rem;
      }
    }

    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetails | null = null;
  quantity: number = 1;
  selectedImage: string | null = null;

  get mainImage(): string {
    return this.product?.images[0] || '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.fetchProductDetails(productId);
  }

  async fetchProductDetails(productId: string | null): Promise<void> {
    if (!productId) {
      this.router.navigate(['/products']);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      this.product = await response.json();
    } catch (error) {
      console.error('Error fetching product details:', error);
      this.router.navigate(['/products']);
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  increaseQuantity(): void {
    if (this.quantity < 99 && this.product?.inStock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      const cartItem = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        description: this.product.description,
        images: this.product.images,
        quantity: 1
      };
      this.cartService.addToCart(cartItem);
      // Show success message or handle UI feedback
    }
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast show position-fixed bottom-0 end-0 m-3 ${type === 'success' ? 'bg-success' : 'bg-danger'} text-white`;
    toast.style.zIndex = '1050';
    toast.style.minWidth = '300px';
    toast.style.padding = '1rem';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas ${icon} me-2"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
