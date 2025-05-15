import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MiniNavComponent } from "./components/mini-nav/mini-nav.component";
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  animateChild, 
  group,
  sequence
} from '@angular/animations';
import { filter } from 'rxjs/operators';

// List of routes for determining direction of animations
const ROUTE_ANIMATION_ORDER = [
  'HomePage',
  'ProductsPage',
  'ProductDetailsPage',
  'ArtistsPage',
  'ArtistProfilePage',
  'CustomOrderPage',
  'CartPage',
  'CheckoutPage',
  'OrderSuccessPage'
];

// Enhanced route animations for smoother transitions
const routeTransitionAnimations = trigger('routeAnimations', [
  // Default transition
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out', 
          style({ 
            opacity: 0,
            transform: 'scale(0.98)'
          })
        )
      ], { optional: true }),
      query(':enter', [
        animate('500ms 150ms ease-out', 
          style({ 
            opacity: 1,
            transform: 'scale(1)'
          })
        )
      ], { optional: true })
    ]),
    query(':enter', animateChild(), { optional: true })
  ]),

  // Forward transitions (moving right in navigation)
  transition((fromState, toState) => {
    const fromIndex = ROUTE_ANIMATION_ORDER.indexOf(fromState);
    const toIndex = ROUTE_ANIMATION_ORDER.indexOf(toState);
    return fromIndex >= 0 && toIndex >= 0 && fromIndex < toIndex;
  }, [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ 
        transform: 'translateX(2%)', 
        opacity: 0 
      })
    ], { optional: true }),
    query(':leave', [
      style({ 
        transform: 'translateX(0)', 
        opacity: 1 
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out', 
          style({ 
            transform: 'translateX(-2%)', 
            opacity: 0 
          })
        )
      ], { optional: true }),
      query(':enter', [
        animate('500ms 150ms ease-out', 
          style({ 
            transform: 'translateX(0)', 
            opacity: 1 
          })
        )
      ], { optional: true })
    ])
  ]),

  // Backward transitions (moving left in navigation)
  transition((fromState, toState) => {
    const fromIndex = ROUTE_ANIMATION_ORDER.indexOf(fromState);
    const toIndex = ROUTE_ANIMATION_ORDER.indexOf(toState);
    return fromIndex >= 0 && toIndex >= 0 && fromIndex > toIndex;
  }, [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ 
        transform: 'translateX(-2%)', 
        opacity: 0 
      })
    ], { optional: true }),
    query(':leave', [
      style({ 
        transform: 'translateX(0)', 
        opacity: 1 
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out', 
          style({ 
            transform: 'translateX(2%)', 
            opacity: 0 
          })
        )
      ], { optional: true }),
      query(':enter', [
        animate('500ms 150ms ease-out', 
          style({ 
            transform: 'translateX(0)', 
            opacity: 1 
          })
        )
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MiniNavComponent, RouterModule],
  template: `
    <div class="main-container">
      <app-navbar></app-navbar>
      <app-mini-nav></app-mini-nav>
      <div class="content-container">
        <div class="route-container page-transition-ready" [@routeAnimations]="prepareRoute(outlet)">
          <router-outlet #outlet="outlet"></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      min-height: 100vh;
      position: relative;
    }

    .content-container {
      width: 100%;
      position: relative;
      overflow-x: hidden;
    }

    .route-container {
      position: relative;
      min-height: 100vh;
    }
  `],
  animations: [routeTransitionAnimations]
})
export class AppComponent implements OnInit {
  title = 'artisan-marketplace';

  constructor(private router: Router) {}

  ngOnInit() {
    // Scroll to top when navigating to a new route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
