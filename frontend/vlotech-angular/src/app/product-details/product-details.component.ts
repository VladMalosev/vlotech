import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {ProductService} from '../product.service';
import {CommonModule} from '@angular/common';
import {AuthService} from '../auth.service';
import {CartService} from '../cart.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})



export class ProductDetailsComponent implements OnInit {
  productId: string | null = ''; // hold product ID from the route params
  product: any; // obj to hold product data


  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router, private authService: AuthService, private cartService: CartService) {
  }


  activeImage: HTMLImageElement | null = null;
  productImages: NodeListOf<HTMLImageElement> | null = null;

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      // Fetch product details from the service using the product ID
      this.productService.getProductById(this.productId).subscribe((data) => {
        this.product = data; // Set the product data to be displayed
      });
    }


    this.activeImage = document.querySelector('.product-image .active');
    this.productImages = document.querySelectorAll('.image-list img');

    // Ensure the active image is not null before adding event listeners
    if (this.productImages && this.activeImage) {
      this.productImages.forEach(image => {
        image.addEventListener('click', this.changeImage.bind(this));
      });
    }
  }

  // Change the active image when another image is clicked
  changeImage(e: Event): void {
    const target = e.target as HTMLImageElement;
    if (this.activeImage && target) {
      this.activeImage.src = target.src;
    }
  }

  // Toggle the navigation menu when clicked
  toggleNavigation(e: Event): void {
    const target = e.target as HTMLElement;
    if (target && target.nextElementSibling) {
      target.nextElementSibling.classList.toggle('active');
    }
  }

  addToCart(productId: string, quantity: number): void {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        // Send request to backend to add the product to the cart
        this.cartService.addToCart(productId, quantity).subscribe({
          next: () => {
            console.log(`Product ${productId} added to cart.`);
          },
          error: (error) => {
            console.error('Error adding product to cart:', error);
          },
        });
      } else {
        // Navigate to login if the user is not authenticated
        this.router.navigate(['/login']);
      }
    });
  }
}
