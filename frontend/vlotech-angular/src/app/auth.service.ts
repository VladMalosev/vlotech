import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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


  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, user)
  }

}
