import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
}
