import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  selectedTab: string = 'info'; // Default selected tab is "My Information"
  user: any = {};
  editUser: any = {};
  changePasswordData = { oldPassword: '', newPassword: '' };
  changeEmailData = { newEmail: '' };
  emailError: string = ''; // Error message for email validation

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
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
}
