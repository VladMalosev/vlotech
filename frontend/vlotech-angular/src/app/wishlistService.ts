import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: any[] = [];

  addToWishlist(product: any) {
    this.wishlist.push(product);
    console.log('Added to wishlist:', product);
  }

  removeFromWishlist(productId: number) {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    console.log('Removed from wishlist:', productId);
  }

  getWishlist() {
    return this.wishlist;
  }
}
