import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Dealer, DealerService } from '../dealers/dealer.service';
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
    private alertService: AlertService, private sanitizer: DomSanitizer,
    private dealerService: DealerService) { }
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
    //this.dealerProduct = this.sanitizer.bypassSecurityTrustScript(productName);
    console.log(productName);
    this.dealerProduct = productName;
     this.dealerService.getDealers().subscribe( dealers => { console.log(dealers); this.dealers = dealers
      .filter( dealer => dealer.categories.includes(productName)); console.log(this.dealers); }, error => {
          if (error.error.err) {
          this.alertService.error(error.error.err);
          } else {
            this.alertService.error(error);
          }
        }
      );
}
}
