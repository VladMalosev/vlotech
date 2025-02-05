import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../wishlist.service';
import { AuthService } from '../auth.service';
import {CommonModule} from '@angular/common';

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
    private router: Router
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
}
