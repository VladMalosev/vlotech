import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})

export class UserProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef; // Access the map container
  selectedTab: string = 'info'; // Default selected tab is "My Information"
  user: any = {};
  editUser: any = {};
  changePasswordData = { oldPassword: '', newPassword: '' };
  changeEmailData = { newEmail: '' };
  emailError: string = ''; // Error message for email validation
  savedLocations: { lat: number; lng: number; address: string }[] = [];
  newLocation: { address: string, name: string } = { address: '', name: '' };
  private map: any;
  private marker: any;





  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}



  ngOnInit(): void {
    this.loadUserProfile();
    if (this.selectedTab === 'saved-location') {
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
      script.src = `https://maps.googleapis.com/maps/api/{API_KEY}}&libraries=places,marker`;
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

    this.loadGoogleMapScript();
  }

  initMap(): void {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error("mapContainer is not available.");
      return;
    }

    const mapOptions = {
      center: {lat: 40.730610, lng: -73.935242}, // Default center (New York)
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
        console.error("No geometry available for this place.");
        return;
      }
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(15);

      this.placeMarker(place.geometry.location);
      this.savedLocations.push({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address
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



  loadUserProfile() {
    this.userService.getUserProfile().subscribe((data) => {
      console.log('User Profile Data:', data);
      this.user = data;
      this.editUser = { ...data };
    }, (error) => {
      console.error('Error fetching user data:', error);
    });
  }

  updateProfile(): void {
    console.log("Updating profile with data:", this.editUser); // Debugging
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




  logout() {
    this.authService.logoutUser().subscribe({
      next: (response) => {
        console.log("Logged out successfully:", response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Logout failed:", error);
      }
    });
  }

  deleteAccount() {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      // Make API call to delete account
      console.log("Account deleted");
    }
  }
  editLocation(index: number): void {
    console.log('Editing location:', this.savedLocations[index]);
    // Implement logic to edit location
  }

  deleteAddress(index: number): void {
    const confirmDelete = confirm("Are you sure you want to delete this address?");
    if (confirmDelete) {
      this.savedLocations.splice(index, 1); // Remove the address from the list
      console.log('Deleted address:', this.savedLocations[index]);
    }
  }
}
