import { Component, OnInit, SecurityContext } from '@angular/core';
import { ProductsService } from './products.service';
import { Dealer, DealerService } from '../dealers/dealer.service';
import { AlertService } from '../alert/alert.service';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PipeTransform, Pipe } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  public test = `<b>This text is bold</b> and this one is <i>italics</i> <img src=x onerror='alert("hello there")'>`;
  public chosenProduct;
  public only = false;
  public productForm: FormGroup;
  public oneProductForm: FormGroup;
  public products = [];
  public names = [];
  public dealerProduct: String;
  public morgen = '';
  public dealers: Dealer[] = [];
  public create = false;
  constructor(private productService: ProductsService,
    private alertService: AlertService, public sanitizer: DomSanitizer,
    private dealerService: DealerService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.getProducts();
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
  });
  this.oneProductForm = this.formBuilder.group({
    product: [this.products[0],Validators.required],
  });
  }
  getOneProduct() {
    this.only = true;
    this.chosenProduct = this.products.filter( product => product.name === this.one.product.value)[0];
    this.showDealersForProducts(this.chosenProduct._id);
    //this.chosenProduct.name = `<b>This text is bold</b> and this one is <i>italics</i> <img src=x onerror='alert("hello there")'>`;
  }
  createProduct() {
    this.create = true;
  }
  stop() {
    this.create = false;
  }
  get one() {return this.oneProductForm.controls; }
  get f() { return this.productForm.controls; }

  onSubmit() {
    this.productService.createProduct({'name': this.f.name.value}).subscribe(data => {this.create = false; this.getProducts();}, error => {
      if (error.error.err) {
        this.alertService.error(error.error.err);
      } else {
        this.alertService.error('Backend down');
      }
  });
  }
  getProduct(name: string) {
      return this.products.filter(product => product.name === name )[0];
  }
  getProducts(): void {
    this.productService.getProducts().subscribe(
        products => {this.products = products;
       }, error => {
        if (error.error.err) {
          this.alertService.error(error.error.err);
        } else {
          this.alertService.error('Backend down');
        }
    });
  }
  showDealersForProducts(productName: String): void  {
    this.dealerProduct = productName;
     this.dealerService.getDealers().subscribe( dealers => { this.dealers = dealers
      .filter( dealer => dealer.categories.includes(productName));  }, error => {
          if (error.error.err) {
          this.alertService.error(error.error.err);
          } else {
            this.alertService.error(error);
          }
        }
      );
}
}
