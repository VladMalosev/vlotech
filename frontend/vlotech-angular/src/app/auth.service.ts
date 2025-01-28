import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {Router} from '@angular/router';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl =  'http://localhost:8080/api/auth/register';
  private loginUrl = 'http://localhost:8080/api/auth/login'
  private logoutUrl = 'http://localhost:8080/api/auth/logout'
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, user)
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials, {
      withCredentials: true,
    });
  }
  logoutUser(): Observable<any> {
    return this.http.post<any>(this.logoutUrl, {}, {
      withCredentials: true,
    });
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.http.post(`${this.API_URL}/validate-token`, {}, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => {
        this.router.navigate(['/login']); // Redirect if not authenticated
        return [false]; // Return false if authentication fails
      })
    );
  }



}
