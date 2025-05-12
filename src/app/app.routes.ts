import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { ArtistProfileComponent } from './components/artist-profile/artist-profile.component';
import { CustomOrderRequestComponent } from './components/custom-order-request/custom-order-request.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', redirectTo: '' },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'artists', component: ArtistsComponent },
    { path: 'artist/:id', component: ArtistProfileComponent },
    { path: 'custom-order', component: CustomOrderRequestComponent }

];
