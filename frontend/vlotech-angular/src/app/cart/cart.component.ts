import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})

export class CartComponent implements OnInit {
  isAgreed: boolean = false;
  cartItems: any[] = [];
  promoCode: string = "";
  discount: number = 0;
  selectedDelivery: string = "standard";
  deliveryCharge: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(
      (items) => {
        this.cartItems = items;
        this.updateTotal();
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  increaseQuantity(item: any): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  private updateQuantity(item: any, newQuantity: number): void {
    if (!item.id) {
      console.error('Product ID is undefined');
      return;
    }

    // Update the cart item locally first
    item.quantity = newQuantity;
    item.totalPrice = item.product.price * item.quantity;

    // Call the service to update the backend (use `updateCartItem` for updating the quantity)
    this.cartService.updateCartItem(item.id, item.quantity).subscribe(
      () => {
        this.updateTotal();
      },
      (error) => {
        console.error('Error updating cart item quantity:', error);
      }
    );
  }

  removeItem(item: any): void {
    this.cartService.removeFromCart(item.id).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
        this.updateTotal();
      },
      (error) => {
        console.error('Error removing item from cart:', error);
      }
    );
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((subtotal, item) => subtotal + item.totalPrice, 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() - this.discount + this.deliveryCharge;
  }

  applyPromoCode(): void {
    if (this.promoCode === "DISCOUNT10") {
      this.discount = 10;
    } else {
      this.discount = 0;
    }
    this.updateTotal();
  }

  updateTotal(): void {
    this.deliveryCharge = this.selectedDelivery === "express" ? 10 : 0;
  }

  checkout(): void {
    if (this.isAgreed) {
      // Proceed with checkout logic
      console.log("Proceeding with checkout");
    } else {
      alert("You must agree to the terms and conditions.");
    }
  }
}
