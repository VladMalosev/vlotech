import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../address.service';
import { UserService } from '../user.service';
import {CartService} from '../cart.service';
import {loadStripe, Stripe} from '@stripe/stripe-js';



@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, AfterViewChecked  {
  savedLocations: any[] = [];
  newLocation = {
    streetNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    flat: '',
    name: ''
  };
  selectedAddressId: number | null = null;
  userId: number | undefined;
  isAddAddressFormVisible = false;
  cartItems: any[] = [];
  discount: number = 0;
  deliveryCharge: number = 0;
  selectedPaymentMethod: string = '';
  creditCardInfo = {
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: '',
    saveCard: false
  };
  paypalInfo = {
    email: ''
  };

  elements: any;
  card: any;
  stripe: Stripe | null = null;
  isStripeInitialized = false;
  constructor(private addressService: AddressService, private userService: UserService, private cartService: CartService) {}
  paymentMessage: string = '';
  paymentSuccess: boolean = false;

  ngAfterViewChecked(): void {
    if (this.selectedPaymentMethod === 'creditCard' && !this.isStripeInitialized) {
      this.initializeStripe();
    }
  }

  initializeStripe() {
    const cardElement = document.getElementById('card-element');
    if (cardElement) {
      loadStripe('pk_test_51Q').then(stripe => {
        if (stripe) {
          this.stripe = stripe;
          this.elements = stripe.elements();
          this.card = this.elements.create('card');
          this.card.mount('#card-element');
          this.isStripeInitialized = true;
        } else {
          console.error('Stripe.js failed to load');
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadSavedAddresses();
    this.fetchCartItems();
  }

  onPaymentMethodChange(paymentMethod: string) {
    if (this.selectedPaymentMethod === 'creditCard' && this.card) {
      this.card.destroy();
      this.isStripeInitialized = false;
    }
    this.selectedPaymentMethod = paymentMethod;
    if (paymentMethod === 'creditCard') {
      this.initializeStripe();
    }
  }

  updateTotal(): void {
    this.deliveryCharge = 10; // potentially will change
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce(
      (subtotal, item) => subtotal + item.totalPrice,
      0
    ).toFixed(2);
  }

  calculateTotal(): number {
    return this.cartItems.reduce(
      (subtotal, item) => subtotal + item.totalPrice,
      0
    );
  }

  fetchCartItems(): void {
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


  // Load user profile to fetch userId
  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (userProfile) => {
        if (userProfile) {
          this.userId = userProfile.id;
          console.log('User ID for checkout:', this.userId);
        } else {
          console.log('User not logged in or profile not found');
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }






  loadSavedAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.savedLocations = data;
        console.log('Loaded saved addresses:', this.savedLocations);

        const primaryAddress = this.savedLocations.find(address => address.primary);
        if (primaryAddress) {
          this.selectedAddressId = primaryAddress.id;
          console.log('Primary address selected:', primaryAddress);
        }
      },
      error: (error) => {
        console.error('Error fetching addresses:', error);
      }
    });
  }


  addNewAddress(): void {
    if (this.isNewAddressValid()) {
      if (this.userId) {
        const addressToSave = { ...this.newLocation };

        this.addressService.addAddress(this.userId.toString(), addressToSave).subscribe({
          next: (savedAddress) => {
            console.log('New address added:', savedAddress);
            this.savedLocations.push(savedAddress);
            this.clearNewLocationForm();
          },
          error: (error) => {
            console.error('Error saving new address:', error);
          }
        });
      } else {
        console.log('User ID is missing');
      }
    } else {
      console.log('Please fill in all the required fields');
    }
  }


  isNewAddressValid(): boolean {
    return !!(this.newLocation.streetNumber && this.newLocation.street && this.newLocation.city &&
      this.newLocation.state && this.newLocation.zipCode && this.newLocation.country);
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId = addressId;
    console.log('Selected address for checkout:', addressId);

    const selectedAddress = this.savedLocations.find(address => address.id === addressId);

    if (selectedAddress && !selectedAddress.primary) {
      if (this.userId) {
        this.addressService.setPrimaryAddress(this.userId.toString(), addressId).subscribe({
          next: () => {
            console.log('Address set as primary:', addressId);

            // Update the local list of addresses to reflect the change
            this.savedLocations.forEach(address => {
              if (address.id === addressId) {
                address.primary = true;
              } else {
                address.primary = false;
              }
            });
          },
          error: (error) => {
            console.error('Error setting primary address:', error);
          }
        });
      } else {
        console.log('User ID is missing');
      }
    }

  }

  clearNewLocationForm(): void {
    this.newLocation = {
      streetNumber: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      flat: '',
      name: ''
    };
  }


  proceedToCheckout(): void {
    if (!this.userId || !this.selectedAddressId) {
      this.paymentMessage = 'Please select an address and ensure user is logged in';
      this.paymentSuccess = false;
      return;
    }

    if (!this.selectedPaymentMethod) {
      this.paymentMessage = 'Please select a payment method';
      this.paymentSuccess = false;
      return;
    }

    if (this.selectedPaymentMethod === 'creditCard') {
      this.processCreditCardPayment();
    } else if (this.selectedPaymentMethod === 'paypal') {
      this.processPayPalPayment();
    } else {
      this.paymentMessage = 'Please select a valid payment method';
      this.paymentSuccess = false;
    }
  }

  processCreditCardPayment(): void {
    if (!this.stripe || !this.card) {
      console.error('Stripe.js or card element is not initialized');
      return;
    }

    const totalAmount = this.calculateTotal() * 100; // Convert to cents for Stripe

    // Create a payment intent or session with your backend
    this.cartService.createStripeSession(totalAmount).subscribe(
      (response) => {
        const sessionId = response.sessionId;
        this.redirectToStripeCheckout(sessionId);
      },
      (error) => {
        console.error('Error creating Stripe session:', error);
      }
    );
  }

  processPayPalPayment(): void {
    if (!this.paypalInfo.email) {
      this.paymentMessage = 'Please enter a valid PayPal email';
      this.paymentSuccess = false;
      return;
    }

    const totalAmount = this.calculateTotal();

    console.log('Processing PayPal payment...');
    this.paymentMessage = 'Processing PayPal payment...';
    this.paymentSuccess = true;

    setTimeout(() => {
      this.paymentMessage = 'PayPal payment successful!';
      this.paymentSuccess = true;
    }, 2000);
  }


  redirectToStripeCheckout(sessionId: string): void {
    const stripePromise = loadStripe('pk_test_51Q');

    stripePromise.then(stripe => {
      if (stripe) {
        stripe.redirectToCheckout({ sessionId }).then((result) => {
          if (result.error) {
            const errorMessage = result.error.message ? result.error.message : 'An unknown error occurred';
            console.error('Error redirecting to checkout:', errorMessage);
          }
        });
      } else {
        console.error('Failed to initialize Stripe');
      }
    });
  }




    deleteAddress(addressId: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(addressId).subscribe({
        next: (response) => {
          console.log('Address deleted successfully', response);
          // Remove the deleted address from the list
          this.savedLocations = this.savedLocations.filter(address => address.id !== addressId);
        },
        error: (error) => {
          console.error('Error deleting address:', error);
        }
      });
    }
  }
  toggleAddAddressForm() {
    this.isAddAddressFormVisible = !this.isAddAddressFormVisible;
  }

}
