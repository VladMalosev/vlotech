import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../address.service';

declare var google: any;

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef; // Access the map container
  selectedTab: string = 'info';
  user: any = {};
  editUser: any = {};
  changePasswordData = { oldPassword: '', newPassword: '' };
  changeEmailData = { newEmail: '' };
  emailError: string = ''; // Error message for email validation
  savedLocations: {
    id?: number;
    lat: number;
    lng: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    name: string;
    contact?: string;
    streetNumber: string;
    flat: string;
    primary?: boolean;
  }[] = [];
  newLocation: {
    streetNumber: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    flat: string,
    name: string,
  } = {
    streetNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    flat: '',
    name: ''
  };
  private map: any;
  private marker: any;
  editingLocation: number | null = null; // To track which location is being edited

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private addressService: AddressService
  ) {}

  editLocation(index: number): void {
    this.editingLocation = index; // Set the location index for editing
  }


  loadSavedAddresses(): void {
    console.log('Fetching saved addresses from AddressService...');
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        console.log('Saved locations fetched successfully:', JSON.stringify(data, null, 2));
        if (!Array.isArray(data)) {
          console.warn('Unexpected response format: Expected an array but received:', data);
        }
        this.savedLocations = data;
        console.log('Updated savedLocations state:', JSON.stringify(this.savedLocations, null, 2));
      },
      error: (error) => {
        console.error('Error fetching saved addresses:', error);
      }
    });
  }


  saveLocationChanges(): void {
    if (this.editingLocation !== null) {
      const addressToUpdate = this.savedLocations[this.editingLocation];
      const addressId = addressToUpdate.id;

      if (addressId !== undefined) {
        this.addressService.updateAddress(addressId, addressToUpdate).subscribe({
          next: () => {
            console.log('Address updated successfully.');
            this.editingLocation = null;
            this.loadSavedAddresses();  // Reload addresses to reflect changes
          },
          error: (error) => {
            console.error('Error updating address:', error);
          }
        });
      } else {
        console.error('Address ID is undefined, cannot update address.');
      }
    }
  }





  ngOnInit(): void {
    this.loadUserProfile();
    if (this.selectedTab === 'saved-location') {
      this.loadSavedAddresses();
      setTimeout(() => this.loadGoogleMapScript(), 500);
    }
  }

  ngAfterViewInit(): void {
    if (this.selectedTab === 'saved-location') {
      this.loadGoogleMapScript();
    }
  }

  loadGoogleMapScript(): void {
    if (typeof google !== 'undefined' && google.maps) {
      this.initMap();
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places,marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.initMap();
      };
      document.body.appendChild(script);
    } else {
      this.initMap();
    }
  }

  selectSavedLocationTab(): void {
    this.selectedTab = 'saved-location';
    this.loadSavedAddresses();
    this.loadGoogleMapScript();
  }

  initMap(): void {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('mapContainer is not available.');
      return;
    }

    const mapOptions = {
      center: { lat: 59.436962, lng: 24.753574 },
      zoom: 15,
      mapId: 'DEMO_MAP_ID',
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Initialize Places Autocomplete
    const input = document.getElementById('autocomplete-input') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', this.map); // Bound the autocomplete results to the map bounds

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.error('No geometry available for this place.');
        return;
      }

      // Set the map center and zoom based on the place
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(15);

      // Extract address components from the place object
      const streetNumber = place.address_components.find((component: any) =>
        component.types.includes('street_number'))?.long_name || '';
      const street = place.address_components.find((component: any) =>
        component.types.includes('route'))?.long_name || '';
      const city = place.address_components.find((component: any) =>
        component.types.includes('locality'))?.long_name || '';
      const state = place.address_components.find((component: any) =>
        component.types.includes('administrative_area_level_1'))?.long_name || '';
      const zipCode = place.address_components.find((component: any) =>
        component.types.includes('postal_code'))?.long_name || '';
      const country = place.address_components.find((component: any) =>
        component.types.includes('country'))?.long_name || '';

      // Combine street number and street name to form the full address
      const fullStreet = streetNumber ? `${streetNumber} ${street}` : street;

      // Place the marker on the map
      this.placeMarker(place.geometry.location);

      // Create new location object with address details
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        street: street,
        streetNumber: streetNumber,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country,
        name: this.newLocation.name,
        contact: '',
        flat: ''
      };

      // Send the new address to the backend
      const userId = this.user.id;
      this.addressService.addAddress(userId, newLocation).subscribe({
        next: (response) => {
          console.log('Address added:', response);

          // Once the new address is added successfully, reload the addresses
          this.loadSavedAddresses();
        },
        error: (error) => {
          console.error('Error adding address:', error);
        }
      });
    });
  }


  placeMarker(location: any): void {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.marker.AdvancedMarkerElement({
      position: location,
      map: this.map,
      title: 'Selected Location',
    });
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (data) => {
        console.log('User Profile Data:', data);
        this.user = data;
        this.editUser = { ...data };
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  updateProfile(): void {
    console.log('Updating profile with data:', this.editUser); // Debugging
    this.userService.updateUser(this.editUser).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.user = { ...this.editUser };
        this.selectedTab = 'info';
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      }
    });
  }

  changePassword(): void {
    if (this.changePasswordData.oldPassword && this.changePasswordData.newPassword) {
      console.log('Sending password change request:', this.changePasswordData);
      this.userService.changePassword(this.changePasswordData).subscribe({
        next: (response) => {
          console.log('Password changed successfully:', response);
          alert('Password changed successfully! You will be logged out.');
          this.logout(); // Log out the user after password change
        },
        error: (error) => {
          console.error('Error changing password:', error);
          alert('Error changing password, please try again.');
        }
      });
    }
  }

  changeEmail(): void {
    this.userService.checkEmailAvailability(this.changeEmailData.newEmail).subscribe({
      next: (response) => {
        if (response.isAvailable) {
          this.userService.changeEmail(this.changeEmailData.newEmail).subscribe({
            next: (response) => {
              alert('Email changed successfully! You will be logged out.');
              this.logout(); // Log out the user after email change
            },
            error: (error) => {
              console.error('Error changing email:', error);
              alert('Error changing email, please try again.');
            }
          });
        } else {
          this.emailError = 'The email is already in use. Please choose a different one.';
        }
      },
      error: (error) => {
        console.error('Error checking email availability:', error);
        alert('Error checking email availability, please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logoutUser().subscribe({
      next: (response) => {
        console.log('Logged out successfully:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

  deleteAccount(): void {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      // Make API call to delete account
      console.log('Account deleted');
    }
  }
  deleteAddress(index: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this address?');
    if (confirmDelete) {
      const address = this.savedLocations[index];
      console.log('Deleting address:', address);

      // Check if address.id is valid
      const addressId = address.id;
      if (addressId && addressId !== null && addressId !== undefined) {
        this.addressService.deleteAddress(addressId).subscribe({
          next: () => {
            console.log('Address deleted successfully:', addressId);
            // Reload saved addresses to ensure it's in sync
            this.loadSavedAddresses();
          },
          error: (error) => {
            console.error('Error deleting address:', error);
          }
        });
      } else {
        console.error('Address ID is undefined or invalid, cannot delete address.');
      }
    }
  }






  cancelEditingLocation(): void {
    this.editingLocation = null;
  }

// Method to set a location as primary
  setPrimary(index: number): void {
    const selectedLocation = this.savedLocations[index];

    // Check if this location is already primary
    if (selectedLocation.primary) {
      console.log('This location is already set as primary.');
      return;
    }

    // Find the current primary address (if any)
    const currentPrimary = this.savedLocations.find(location => location.primary);
    if (currentPrimary) {
      currentPrimary.primary = false; // Unset the current primary address
    }

    selectedLocation.primary = true;

    if (selectedLocation.id !== undefined && selectedLocation.id !== null) {
      const userId = this.user.id;  // Assuming `this.user.id` contains the logged-in user's ID

      this.addressService.setPrimaryAddress(userId, selectedLocation.id).subscribe({
        next: () => {
          console.log('Address set as primary successfully.');
          this.loadSavedAddresses(); // To ensure the UI reflects the changes
        },
        error: (error) => {
          console.error('Error setting address as primary:', error);
        }
      });
    } else {
      console.error('Address ID is undefined, cannot set primary address.');
    }
  }

}
