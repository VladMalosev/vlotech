import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';

import {LoginComponent} from './login/login.component';
import {ProductListComponent} from './product-list/product-list.component';
import {RegisterComponent} from './register/register.component';
import {ProductDetailsComponent} from './product-details/product-details.component';
import {CartComponent} from './cart/cart.component';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent },
  { path: 'search', component: ProductListComponent},
  { path: 'login', component: LoginComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'home' }
];
