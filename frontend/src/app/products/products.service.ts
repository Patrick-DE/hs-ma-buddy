import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SafeScript } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<Products[]> {

    return this.http.get<Products[]>('/category');
}

createProduct(product: SafeScript) {
  return this.http.post<Products[]>('/category', product);
}
}
export interface Products {
  name: string;
  _id: String;
}
