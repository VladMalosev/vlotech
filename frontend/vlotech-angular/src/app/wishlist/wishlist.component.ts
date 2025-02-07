import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../wishlist.service';
import { AuthService } from '../auth.service';
import {CommonModule} from '@angular/common';
import {CartService} from '../cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  dataLoaded: boolean = false;

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.wishlistService.getWishlistItems().subscribe(
          (items: any[]) => {
            this.wishlistItems = items;
            this.dataLoaded = true;
          },
          (error) => {
            console.error('Error fetching wishlist items:', error);
          }
        );
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleWishlistItem(item: any): void {
    if (item.inWishlist) {
      this.wishlistService.removeFromWishlist(item.id).subscribe(() => {
        item.inWishlist = false;
      });
    } else {
      this.wishlistService.addToWishlist(item.id).subscribe(() => {
        item.inWishlist = true;
      });
    }
  }


  clearWishlist(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return;
      }

      this.wishlistService.clearWishlist().subscribe({
        next: () => {
          console.log('Wishlist cleared');
          this.wishlistItems = []; // Clear UI
        },
        error: (error) => {
          console.error('Error clearing wishlist:', error);
        }
      });
    });
  }


  removeFromWishlist(item: any): void {
    // Stop event propagation to prevent triggering navigation
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return;
      }

      this.wishlistService.removeFromWishlist(item.product.id).subscribe(
        () => {
          console.log(`${item.product.name} removed from wishlist`);
          // Update the UI to remove the item
          this.wishlistItems = this.wishlistItems.filter(wishlistItem => wishlistItem.product.id !== item.product.id);
        },
        (error) => {
          console.error('Error removing from wishlist:', error);
        }
      );
    });
  }

  navigateToProductDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }


  moveToCart(productId: string, quantity: number): void {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        // Add the product to the cart
        this.cartService.addToCart(productId, quantity).subscribe({
          next: () => {
            console.log(`Product ${productId} added to cart.`);
            // After adding to cart, remove the product from the wishlist
            this.removeFromWishlistById(productId);  // Remove from wishlist based on product ID
          },
          error: (error) => {
            console.error('Error adding product to cart:', error);
          },
        });
      } else {
        // If not authenticated, navigate to login
        this.router.navigate(['/login']);
      }
    });
  }

  removeFromWishlistById(productId: string): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.product.id !== productId);
  }

  calculateWishlistTotal(): number {
    return this.wishlistItems.reduce((total, item) => total + item.product.price, 0).toFixed(2);
  }

  moveAllToCart(): void {
    this.wishlistItems.forEach(item => {
      this.moveToCart(item.product.id, 1);
    });

    this.wishlistItems = [];
  }
}
