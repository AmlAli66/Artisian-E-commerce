import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mini-nav" [class.visible]="isVisible">
      <ul class="nav-list">
        <li>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"
             title="Home">
            <i class="fas fa-home"></i>
          </a>
        </li>
        <li>
          <a routerLink="/products" routerLinkActive="active" title="Products">
            <i class="fas fa-shop"></i>
          </a>
        </li>
        <li>
          <a routerLink="/artists" routerLinkActive="active" title="Artists">
            <i class="fas fa-palette"></i>
          </a>
        </li>
        <li>
          <a routerLink="/custom-order" routerLinkActive="active" title="Custom Order">
            <i class="fas fa-wand-magic-sparkles"></i>
          </a>
        </li>
        <li>
          <a routerLink="/cart" routerLinkActive="active" title="Cart" class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span *ngIf="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .mini-nav {
      position: fixed;
      left: 0;
      top: 50%;
      transform: translateY(-50%) translateX(-100%);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 1rem 0.5rem;
      border-radius: 0 15px 15px 0;
      box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
      z-index: 1025;
      transition: transform 0.3s ease-in-out;

      &.visible {
        transform: translateY(-50%) translateX(0);
      }

      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        li {
          a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: #36454F;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;

            i {
              font-size: 1.2rem;
            }

            &:hover, &.active {
              color: #8A9A5B;
              background: rgba(138, 154, 91, 0.1);
            }

            &.cart-icon {
              .cart-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #D4AF37;
                color: white;
                font-size: 0.7rem;
                padding: 0.2rem 0.4rem;
                border-radius: 10px;
                min-width: 18px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  `]
})
export class MiniNavComponent implements OnInit, OnDestroy {
  isVisible: boolean = false;
  cartItemsCount: number = 0;
  private cartSubscription: Subscription;
  private lastScrollTop: number = 0;
  private readonly SHOW_THRESHOLD = window.innerHeight; // Show after first viewport

  constructor(private cartService: CartService) {
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const st = window.scrollY;
    
    // Show mini nav when scrolled past first viewport and scrolling down
    if (st > this.SHOW_THRESHOLD) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
    
    this.lastScrollTop = st;
  }

  ngOnInit(): void {
    // Check initial scroll position
    this.onScroll();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
} 