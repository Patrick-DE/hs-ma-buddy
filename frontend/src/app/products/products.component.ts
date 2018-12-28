import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Dealer } from '../dealers/dealer.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products = [];
  public dealerProduct: String = '';
  public dealers: Dealer[] = [];
  constructor(private productService: ProductsService) { }
  ngOnInit() {
    this.getProducts();
  }
  getProducts(): void {
    this.productService.getProducts().subscribe(products => this.products = products);
}
  showDealersForProducts(productName: String): void  {
    console.log(productName);
    this.dealerProduct = productName;
    this.dealers = [{
    'moodle_id': 2,
    'first_name': 'cornelius',
    'last_name': 'black',
    'mobile': '010123213',
    'email2': 'black@black',
    'available': true,
    'room': '108',
    'blocked': false,
    'away': true,
    'away_reason': 'no bock'},
    {
      'moodle_id': 2,
      'first_name': 'Albus',
      'last_name': 'Dumbledore',
      'mobile': '010123213',
      'email2': 'black@black',
      'available': true,
      'room': '108',
      'blocked': false,
      'away': true,
      'away_reason': 'no bock'}];
  }
}
