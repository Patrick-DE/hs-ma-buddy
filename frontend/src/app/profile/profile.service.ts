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
     return this.http.get<User>('/me');
   }
   myProfile(id: String): Observable<Dealer> {
    return this.http.get<Dealer>(`/buddy/${id}`);
  }
  updateProfile( dealer: Dealer) {
    return this.http.put(`/buddy/`, dealer);
  }
}
export interface User {
    buddy: String;
}
