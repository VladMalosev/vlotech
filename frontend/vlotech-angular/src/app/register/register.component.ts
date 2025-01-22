import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService, User} from '../auth.service';
import {Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  };

  passwordConfirmation: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  passwordMismatch(): boolean {
    return this.user.password !== this.passwordConfirmation;
  }

  //method to handle form submission
  onSubmit(): void {
    if (this.passwordMismatch()) {
      alert('Passwords do not match');
      return;
    }

    this.authService.registerUser(this.user).subscribe(
      response => {
        console.log('User registered successfully!', response);
      this.router.navigate(['/login'])
      },
      error => {
        console.log('Registration error!', error);
        alert('An error occured. Please try again later.')
      }
    );
  }
}
