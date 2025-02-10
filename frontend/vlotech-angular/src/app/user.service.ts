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
  changePassword(changePasswordData: any) {
    return this.http.put(`${this.apiUrl}/update-password`, changePasswordData, { withCredentials: true });
  }
  changeEmail(newEmail: string) {
    return this.http.put(`${this.apiUrl}/update-email`, { email: newEmail }, { withCredentials: true });
  }
  checkEmailAvailability(newEmail: string) {
    return this.http.get<{ isAvailable: boolean }>(`${this.apiUrl}/check-email`, { params: { email: newEmail }, withCredentials: true });
  }
  updateAddress(address: any) {
    return this.http.put('/api/user/address', address);
  }

  deleteAddress(address: any) {
    return this.http.delete('/api/user/address', { params: { address: address.address } });
  }

}
