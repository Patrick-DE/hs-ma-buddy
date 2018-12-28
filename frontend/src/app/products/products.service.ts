import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<Products[]> {

    return this.http.get<Products[]>('http://localhost:3000/category');
}
}
export interface Products {
  name: String;
}
