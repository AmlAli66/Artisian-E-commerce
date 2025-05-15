import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-mini-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mini-nav" [class.visible]="isVisible">
      <ul class="nav-list">
        <li>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" title="Home">
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
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 1rem 0.5rem;
      border-radius: 0 15px 15px 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 2px 0 20px rgba(233, 183, 183, 0.1);
      z-index: 3025;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
      opacity: 0;

      &.visible {
        transform: translateY(-50%) translateX(0);
        opacity: 1;
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
            color: #8C6B5C;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;

            i {
              font-size: 1.2rem;
            }

            &:hover, &.active {
              color: #E9B7B7;
              background: rgba(233, 183, 183, 0.1);
            }

            &.active::after {
              content: '';
              position: absolute;
              right: -5px;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 20px;
              background: linear-gradient(to bottom, #E9B7B7, #A8B79E);
              border-radius: 3px;
            }

            &.cart-icon {
              .cart-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: linear-gradient(135deg, #E9B7B7, #A8B79E);
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

  private cartSubscription!: Subscription;
  private routerSubscription!: Subscription;
  private readonly SHOW_THRESHOLD = 100;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.handleScroll();

    // listen to scroll globally
    window.addEventListener('scroll', this.handleScroll, true);

    // listen to route change
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // wait a moment for content to load then recheck scroll
      setTimeout(() => this.handleScroll(), 100);
    });

    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  handleScroll = (): void => {
    const scrollY = window.scrollY || window.pageYOffset;
    this.isVisible = scrollY > this.SHOW_THRESHOLD;
  };
}
