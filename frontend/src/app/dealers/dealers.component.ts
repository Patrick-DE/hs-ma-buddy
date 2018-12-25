import { Component, OnInit } from '@angular/core';
import { Dealer, DealerService } from './dealer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss']
})
export class DealersComponent implements OnInit {
  public dealers: Dealer[];
  constructor( private dealerService: DealerService) { }

  ngOnInit() {
    this.getDealers();
  }

  getDealers(): void {
       this.dealerService.getDealers().subscribe(dealers => this.dealers = dealers);
  }
}
