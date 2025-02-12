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

  setPrimaryAddress(userId: string, addressId: number): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}/set-primary?userId=${userId}&addressId=${addressId}`,
      {},
      { withCredentials: true }
    );
  }


  // Delete address
  deleteAddress(addressId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${addressId}`, { withCredentials: true }).pipe(
      tap((response) => {
        console.log(`Deleted address with ID: ${addressId}`, response);
      }),
      catchError((error) => {
        console.error('Error deleting address:', error);
        return throwError(() => new Error('Error deleting address'));
      })
    );
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
  updateAddress(addressId: number, updatedAddress: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${addressId}`, updatedAddress, { withCredentials: true }).pipe(
      tap(() => console.log(`Updated address with ID: ${addressId}`)),
      catchError((error) => {
        console.error('Error updating address:', error);
        return throwError(() => new Error('Error updating address'));
      })
    );
  }
}
