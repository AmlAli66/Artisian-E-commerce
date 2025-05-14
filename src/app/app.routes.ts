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
        redirectTo: '/products',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'products',
        loadComponent: () => 
            import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'cart',
        loadComponent: () => 
            import('./components/cart/cart.component').then(m => m.CartComponent)
    },
    {
        path: 'products/:id',
        loadComponent: () => 
            import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent)
    },
    {
        path: 'checkout',
        loadComponent: () => 
            import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
    },
    {
        path: 'order-success',
        loadComponent: () => 
            import('./components/order-success/order-success.component').then(m => m.OrderSuccessComponent)
    },
    {
        path: 'artists',
        component: ArtistsComponent
    },
    {
        path: 'artist/:id',
        loadComponent: () => 
            import('./components/artist-profile/artist-profile.component').then(m => m.ArtistProfileComponent)
    },
    {
        path: 'custom-order',
        component: CustomOrderWizardComponent
    }
];
