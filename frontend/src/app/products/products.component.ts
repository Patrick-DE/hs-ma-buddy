import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Dealer } from '../dealers/dealer.service';
import { AlertService } from '../alert/alert.service';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products = [];
  public dealerProduct: String = '';
  public dealers: Dealer[] = [];
  constructor(private productService: ProductsService,
    private alertService: AlertService, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.getProducts();
  }
  getProducts(): void {
    this.productService.getProducts().subscribe(
      products => {this.products = products; }, error => {
        if (error.error.err) {
          this.alertService.error(error.error.err);
        } else {
          this.alertService.error('Backend down');
        }
    });
  }
  showDealersForProducts(productName: String): void  {
    console.log(productName);
    //this.dealerProduct = this.sanitizer.bypassSecurityTrustScript(productName);
    this.dealerProduct = productName;
    this.dealers = [{
    'dealer_id': '',
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
      'dealer_id': '',
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
