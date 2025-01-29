import { Component, OnInit } from '@angular/core';
import {CartService} from '../cart.service';
import {CommonModule} from '@angular/common';

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId: string;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(
      (items) => {
        this.cartItems = items;
        console.log(this.cartItems);
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }
  // Method to increase the quantity of an item
  increaseQuantity(item: any): void {
    const updatedQuantity = item.quantity + 1;
    this.updateQuantity(item, updatedQuantity);
  }

  // Method to decrease the quantity of an item
  decreaseQuantity(item: any): void {
    const updatedQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
    this.updateQuantity(item, updatedQuantity);
  }


  private updateQuantity(item: any, newQuantity: number): void {
    if (!item.product.id) {
      console.error('Product ID is undefined');
      return;
    }

    item.quantity = newQuantity;
    item.totalPrice = item.unitPrice * item.quantity;

    this.cartService.addToCart(item.product.id, item.quantity).subscribe(
      (updatedItem) => {
        item = updatedItem;
      },
      (error) => {
        console.error('Error updating cart item quantity:', error);
      }
    );
  }

  // Method to remove an item from the cart
  removeItem(item: any): void {
    this.cartService.removeFromCart(item.id).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
      },
      (error) => {
        console.error('Error removing item from cart:', error);
      }
    );
  }

  // Method to calculate the subtotal of the cart
  calculateSubtotal(): number {
    return this.cartItems.reduce((subtotal, item) => subtotal + item.totalPrice, 0);
  }
}
