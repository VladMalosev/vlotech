import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private readonly apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}



  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add?productId=${productId}&quantity=${quantity}`,
      {},
      { withCredentials: true }
    );
  }

  updateCartItem(cartItemId: string, quantity: number): Observable<any> {
    const params = new HttpParams()
      .set('cartItemId', cartItemId)
      .set('quantity', quantity.toString());

    return this.http.post(
      `${this.apiUrl}/update`,
      params,
      { withCredentials: true }
    );
  }

  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/items`,
      { withCredentials: true }
    );
  }
  removeFromCart(cartItemId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/remove?cartItemId=${cartItemId}`,
      { withCredentials: true }
    );
  }
}
