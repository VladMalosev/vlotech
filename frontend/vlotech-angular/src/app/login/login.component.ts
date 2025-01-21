import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    // Initialize the form with controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Example: Hardcoded credentials
      if (email === 'test@example.com' && password === 'password123') {
        alert('Login successful!');
        this.router.navigate(['/dashboard']); // Navigate to dashboard
      } else {
        alert('Invalid credentials.');
      }
    } else {
      alert('Please fill in the form correctly.');
    }
  }
}
