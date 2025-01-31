import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { withCredentials: true });
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, user, { withCredentials: true });
  }
}
