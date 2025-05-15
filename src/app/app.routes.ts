import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { ArtistProfileComponent } from './components/artist-profile/artist-profile.component';
import { CustomOrderWizardComponent } from './components/custom-order/custom-order-wizard.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { animation: 'HomePage' }
    },
    {
        path: 'products',
        loadComponent: () => 
            import('./components/product-list/product-list.component').then(m => m.ProductListComponent),
        data: { animation: 'ProductsPage' }
    },
    {
        path: 'cart',
        loadComponent: () => 
            import('./components/cart/cart.component').then(m => m.CartComponent),
        data: { animation: 'CartPage' }
    },
    {
        path: 'products/:id',
        loadComponent: () => 
            import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent),
        data: { animation: 'ProductDetailsPage' }
    },
    {
        path: 'checkout',
        loadComponent: () => 
            import('./components/checkout/checkout.component').then(m => m.CheckoutComponent),
        data: { animation: 'CheckoutPage' }
    },
    {
        path: 'order-success',
        loadComponent: () => 
            import('./components/order-success/order-success.component').then(m => m.OrderSuccessComponent),
        data: { animation: 'OrderSuccessPage' }
    },
    {
        path: 'artists',
        component: ArtistsComponent,
        data: { animation: 'ArtistsPage' }
    },
    {
        path: 'artist/:id',
        loadComponent: () => 
            import('./components/artist-profile/artist-profile.component').then(m => m.ArtistProfileComponent),
        data: { animation: 'ArtistProfilePage' }
    },
    {
        path: 'custom-order',
        component: CustomOrderWizardComponent,
        data: { animation: 'CustomOrderPage' }
    }
];
