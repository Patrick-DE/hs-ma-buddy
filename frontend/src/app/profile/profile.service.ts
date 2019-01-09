import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dealer } from '../dealers/dealer.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {
   }
   myUser(): Observable<User> {
     return this.http.get<User>('http://localhost:3000/me');
   }
   myProfile(id: String): Observable<Dealer> {
    return this.http.get<Dealer>(`http://localhost:3000/buddy/${id}`);
  }
  updateProfile( dealer: Dealer) {
    return this.http.put(`http://localhost:3000/buddy/`, dealer);
  }
}
export interface User {
    buddy: String;
}
