import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient) { }
  sendSearch(message: String) {
    console.log(message);
    return this.http.post(`http://localhost:3000/search`, message);
  }
}
