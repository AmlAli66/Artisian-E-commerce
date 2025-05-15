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
          <i class="fas fa-burn me-2"></i>
          Scented Reverie
        </a>

        <!-- Mobile Cart Icon -->
        <div class="mobile-cart d-lg-none">
          <a class="cart-link" routerLink="/cart">
            <i class="fas fa-shopping-bag"></i>
            <span class="cart-count" *ngIf="cartItemsCount > 0">{{ cartItemsCount }}</span>
          </a>
        </div>

        <!-- Toggle Button (visible only on smaller screens) -->
        <button class="navbar-toggler d-lg-none" type="button" 
                (click)="isMenuOpen = !isMenuOpen"
                [attr.aria-expanded]="isMenuOpen">
          <i class="fas" [class.fa-times]="isMenuOpen" [class.fa-bars]="!isMenuOpen"></i>
        </button>

        <!-- Navigation Items -->
        <div class="collapse navbar-collapse" [class.show]="isMenuOpen">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/home" routerLinkActive="active" 
                 (click)="closeMenu()">
                 <i class="fas fa-home me-1"></i>Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active"
                 (click)="closeMenu()">
                 <i class="fas fa-shop me-1"></i>Products
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/artists" routerLinkActive="active"
                 (click)="closeMenu()">
                 <i class="fas fa-palette me-1"></i>Artists
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/custom-order" routerLinkActive="active"
                 (click)="closeMenu()">
                 <i class="fas fa-wand-magic-sparkles me-1"></i>Custom Order
              </a>
            </li>
          </ul>

          <!-- Desktop Cart -->
          <div class="nav-cart d-none d-lg-block">
            <a class="cart-link" routerLink="/cart">
              <i class="fas fa-shopping-bag"></i>
              <span class="cart-count" *ngIf="cartItemsCount > 0">{{ cartItemsCount }}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      transition: all 0.4s ease;
      padding: 1.5rem 0;
      width: 100%;
      z-index: 1000;
    }

    .navbar-brand {
      font-family: 'Playfair Display', serif;
      font-size: 1.7rem;
      background: linear-gradient(135deg, #E9B7B7, #A8B79E);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
      font-weight: 700;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      i {
        background: linear-gradient(135deg, #E9B7B7, #A8B79E);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
      }
    }

    .cart-link {
      position: relative;
      color: #8C6B5C;
      font-size: 1.2rem;
      padding: 0.5rem;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        color: #E9B7B7;
        transform: translateY(-2px);
      }
    }

    .cart-count {
      position: absolute;
      top: 0;
      right: 0;
      background: linear-gradient(135deg, #E9B7B7, #A8B79E);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(50%, -30%);
    }

    .mobile-cart {
      margin-right: 1rem;
    }

    @media (max-width: 991px) {
      .navbar-collapse {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 0 0 20px 20px;
        margin-top: 0.5rem;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
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
          display: inline-flex;
          justify-content: center;
          
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
