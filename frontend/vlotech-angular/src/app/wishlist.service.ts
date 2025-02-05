import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = 'http://localhost:8080/api/wishlist';

  constructor(private http: HttpClient) {}

  addToWishlist(productId: string): Observable<any> {
    const params = new HttpParams().set('productId', productId);
    return this.http.post(`${this.baseUrl}/add`, null, { params, withCredentials: true });
  }

  getWishlistItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/items`, { withCredentials: true });
  }

  removeFromWishlist(wishlistItemId: string): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/wishlist/remove/${wishlistItemId}`, { withCredentials: true });
  }

}
