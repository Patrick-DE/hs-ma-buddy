import { Component, OnInit } from '@angular/core';
import { Dealer, DealerService } from './dealer.service';
import { Observable } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { CalendarService, Block } from '../calendar/calendar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Products, ProductsService } from '../products/products.service';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss']
})
export class DealersComponent implements OnInit {
  public dealers: Dealer[] = [];
  public blocks: Block[] = [];
  public products: Products[] = [];
  public appointmentForm: FormGroup;
  public submitted = false;
  public appointment: String ;
  public blockForm: FormGroup;
  public loading = false;
  block_id: String = '';
  constructor( private dealerService: DealerService,
    private alertService: AlertService,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder,
    private productService: ProductsService) { }
  ngOnInit() {
    this.getDealers();
    this.getBlocks();
    this.getProducts();
    this.appointmentForm = this.formBuilder.group({
      beschreibung: ['', Validators.required],
      block: ['', Validators.required],
      produkt: ['', Validators.required],
      jahr: [2019],
      monat: [1],
      tag: [15],
      raum:['', Validators.required]
  });
  }
  get f() { return this.appointmentForm.controls; }
  getDealers(): void {
       this.dealerService.getDealers().subscribe(dealers => {
         this.dealers = dealers; },
         error => {
          if (error.error.err) {
          this.alertService.error(error.error.err);
          } else {
            this.alertService.error('Backend down');
          }
      });
  }
  activateCreateAppointment(email: String) {
    this.appointment = email;
  }
  getProducts() {
    this.productService.getProducts().subscribe(products => this.products = products);
  }
  getBlocks() {
    this.calendarService.getBlocks().subscribe(blocks => {
      this.blocks = blocks; });
  }
  createAppointment(dealerId: String, room: String) {
    this.submitted = true;
    if (this.appointmentForm.invalid) {
      return;
  }
    if (this.f.block.value > this.blocks.length) {
      this.alertService.error('Block doesnt exist');
      return;
    }
    if (!(this.getProduct(this.f.produkt.value).length > 0)) {
      this.alertService.error('Product doesnt exist');
      return;
    }
    return this.calendarService.sendAppointment({buddy_id: dealerId, room: this.f.raum.value,
      category_id: this.getProduct(this.f.produkt.value)[0]._id,
     block_id: this.blocks[this.f.block.value - 1].id, description: this.f.beschreibung.value,
     date: new Date(this.f.jahr.value, this.f.monat.value - 1 , this.f.tag.value + 1 ),
  status: false }).pipe()
  .subscribe(
      data => {this.appointment = '';
      this.alertService.success('Appointment created');
    }, error => {
        if (error.error.err) {
        this.alertService.error(error.error.err);
        } else {
          this.alertService.error(error);
        }
      });
  }
  getProduct(productName: String): Products[] {
    const categorys = this.products;
    return categorys.filter( product => product.name === productName);
  }
}
