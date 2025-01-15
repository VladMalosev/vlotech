import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';

import {LoginComponent} from './login/login.component';
import {ProductListComponent} from './product-list/product-list.component';
import {RegisterComponent} from './register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: ProductListComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
