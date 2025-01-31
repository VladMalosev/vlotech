import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    // Initialize the form with controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.loginUser({ email, password }).subscribe(
        (response) => {
          //  will change to cookies later
          alert('Login successful!');
          this.router.navigate(['/home']); //placeholder for now
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Invalid credentials. Please try again.');
        }
      );
    } else {
      alert('Please fill in the form correctly.');
    }
  }
}

