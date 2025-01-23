import { Component } from '@angular/core';

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}


@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})


export class CartComponent {
  cartItems: CartItem[] = [
    {
      name: 'Sample Product 1',
      price: 25.0,
      image: 'https://m.media-amazon.com/images/I/41tp0JPPlmL.jpg',
      quantity: 1,
    },
    {
      name: 'Sample Product 2',
      price: 15.0,
      image: 'https://m.media-amazon.com/images/I/41tp0JPPlmL.jpg',
      quantity: 2,
    },
  ];

  // Function to calculate subtotal
  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Function to decrease quantity
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  // Function to increase quantity
  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }

  // Function to remove item
  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter((cartItem) => cartItem !== item);
  }
}
