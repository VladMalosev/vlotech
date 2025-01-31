import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {UserService} from '../user.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  selectedTab: string = 'info'; // Default selected tab is "My Information"
  user: any = {};
  wishlist: any[] = [];
  cart: any[] = [];
  savedCards: any[] = [];
  orders: any[] = [];
  savedAddresses: string[] = [];
  returns: any[] = [];
  activeSection: string = 'info';

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  setActiveSection(section: string) {
    console.log("Active Section Changed:", section);
    this.activeSection = section;
  }


  loadUserProfile() {
    this.userService.getUserProfile().subscribe((data) => {
      console.log('User Profile Data:', data);
      this.user = data;
    }, (error) => {
      console.error('Error fetching user data:', error);
    });
  }



  logout() {
    // Clear session or authentication token, then redirect
    console.log("Logging out...");
    // Redirect to login page or home page
  }

  deleteAccount() {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      // Make API call to delete account
      console.log("Account deleted");
    }
  }

/*  saveProfileChanges() {
    this.userService.updateUserProfile(this.user).subscribe((response) => {
      console.log("Profile updated successfully:", response);
      // You might want to show a success message or refresh the user profile data
    }, (error) => {
      console.error("Error updating profile:", error);
      // Handle error (e.g., show an error message)
    });
  }*/
}
