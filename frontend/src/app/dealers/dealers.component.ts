import { Component, OnInit } from '@angular/core';
import { Dealer, DealerService } from './dealer.service';
import { Observable } from 'rxjs';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss']
})
export class DealersComponent implements OnInit {
  public dealers: Dealer[] = [];
  constructor( private dealerService: DealerService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getDealers();
  }

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
}
