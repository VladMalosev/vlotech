import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';

import {LoginComponent} from './login/login.component';
import {ProductListComponent} from './product-list/product-list.component';
import {RegisterComponent} from './register/register.component';
import {ProductDetailsComponent} from './product-details/product-details.component';
import {CartComponent} from './cart/cart.component';
import {AuthGuard} from './auth.guard';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {RedirectIfAuthenticatedGuard} from './RedirectIfAuthenticatedGuard';
import {WishlistComponent} from './wishlist/wishlist.component';
import {CheckoutComponent} from './checkout/checkout.component';

export const routes: Routes = [
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserProfileComponent, canActivate: [AuthGuard] },


  //will be changed
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },




  { path: 'home', component: HomeComponent },
  { path: 'search', component: ProductListComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectIfAuthenticatedGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [RedirectIfAuthenticatedGuard]
  },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: '**', redirectTo: 'home' }
];
