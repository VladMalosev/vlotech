import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentOptionService {
  private readonly apiUrl = 'http://localhost:8080/api/payment-options';

  constructor(private http: HttpClient) {}

  // Add a new payment method
  addPaymentOption(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, paymentData, { withCredentials: true });
  }

  // Get all payment methods for a user
  getUserPaymentOptions(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
  }

  // Get the decrypted card number for a specific payment method
  getDecryptedCardNumber(paymentOptionId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${paymentOptionId}/decrypt`, { withCredentials: true });
  }

  // Delete a payment method
  deletePaymentOption(paymentOptionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${paymentOptionId}`, { withCredentials: true });
  }
}
