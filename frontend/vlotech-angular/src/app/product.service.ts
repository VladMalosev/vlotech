import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
// service to fetch details
export class ProductService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/products';


  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);  }

}
