import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg" [class.scrolled]="isScrolled">
      <div class="container">
        <!-- Brand -->
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-fire-alt me-2"></i>
          Scented Reverie
        </a>

        <!-- Mobile Cart Icon -->
        <div class="mobile-cart d-lg-none">
          <a class="cart-link" routerLink="/cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count" *ngIf="cartItemsCount > 0">{{ cartItemsCount }}</span>
          </a>
        </div>

        <!-- Toggle Button -->
        <button class="navbar-toggler" type="button" 
                (click)="isMenuOpen = !isMenuOpen"
                [attr.aria-expanded]="isMenuOpen">
          <i class="fas" [class.fa-times]="isMenuOpen" [class.fa-bars]="!isMenuOpen"></i>
        </button>

        <!-- Navigation Items -->
        <div class="collapse navbar-collapse" [class.show]="isMenuOpen">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/home" routerLinkActive="active" 
                 (click)="closeMenu()">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active"
                 (click)="closeMenu()">Products</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/artists" routerLinkActive="active"
                 (click)="closeMenu()">Artists</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/custom-order" routerLinkActive="active"
                 (click)="closeMenu()">Custom Order</a>
            </li>
          </ul>

          <!-- Desktop Cart -->
          <div class="nav-cart d-none d-lg-block">
            <a class="cart-link" routerLink="/cart">
              <i class="fas fa-shopping-cart"></i>
              <span class="cart-count" *ngIf="cartItemsCount > 0">{{ cartItemsCount }}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      padding: 1rem 0;
      // position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .navbar.scrolled {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      background-color: rgba(255, 255, 255, 0.98);
    }

    .navbar-brand {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      color: #8A9A5B;
      transition: color 0.3s ease;

      &:hover {
        color: darken(#8A9A5B, 10%);
      }

      i {
        color: #D4AF37;
      }
    }

    .navbar-toggler {
      border: none;
      padding: 0.5rem;
      color: #36454F;
      
      &:focus {
        box-shadow: none;
        outline: none;
      }

      i {
        font-size: 1.5rem;
        transition: all 0.3s ease;
      }
    }

    .nav-link {
      color: #36454F;
      font-weight: 500;
      padding: 0.5rem 1rem;
      position: relative;
      transition: all 0.3s ease;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 1rem;
        height: 2px;
        background-color: #8A9A5B;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      &:hover, &.active {
        color: #8A9A5B;

        &:after {
          transform: scaleX(1);
        }
      }
    }

    .cart-link {
      position: relative;
      color: #36454F;
      font-size: 1.2rem;
      padding: 0.5rem;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: #8A9A5B;
      }
    }

    .cart-count {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #8A9A5B;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      transform: translate(50%, -50%);
    }

    .mobile-cart {
      margin-right: 1rem;
    }

    @media (max-width: 991px) {
      .navbar-collapse {
        background: white;
        padding: 1rem;
        border-radius: 0 0 1rem 1rem;
        margin-top: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        
        &.show {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .navbar-nav {
        text-align: center;
        padding: 1rem 0;

        .nav-item {
          margin: 0.5rem 0;
        }

        .nav-link {
          display: inline-block;
          
          &:after {
            left: 25%;
            right: 25%;
          }
        }
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartItemsCount: number = 0;
  isScrolled: boolean = false;
  isMenuOpen: boolean = false;
  private cartSubscription: Subscription;

  constructor(private cartService: CartService) {
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  ngOnInit(): void {
    // Initial cart count handled by subscription
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
