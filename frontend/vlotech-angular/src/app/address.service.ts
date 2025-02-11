import { Injectable } from '@angular/core';
import {catchError, Observable, tap, throwError} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:8080/api/addresses';

  constructor(private http: HttpClient) { }

  // Add address
  addAddress(userId: string, newLocation: any): Observable<any> {
    const body = {
      street: newLocation.street,
      streetNumber: newLocation.streetNumber,
      city: newLocation.city,
      state: newLocation.state,
      zipCode: newLocation.zipcode,
      country: newLocation.country,
      flatNumber: newLocation.flatNumber,
      name: newLocation.name,
      house: newLocation.house
    };

    return this.http.post(`${this.apiUrl}/add?userId=${userId}`, body, { withCredentials: true });
  }

  // Set primary address
  setPrimaryAddress(userId: string, addressId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/set-primary?userId=${userId}&addressId=${addressId}`, {});
  }

  // Delete address
  deleteAddress(address: { lat: number; lng: number; address: string }): Observable<any> {
    return this.http.request('delete', this.apiUrl, { body: address });
  }

  // Get all addresses
  getAddresses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { withCredentials: true }).pipe(
      tap((addresses) => console.log('Fetched addresses:', addresses)),
      catchError((error) => {
        console.error('Error fetching addresses:', error);
        return throwError(() => new Error('Error fetching addresses'));
      })
    );
  }



  // Update an existing address
  updateAddress(address: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, address);
  }
}
