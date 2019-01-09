import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  constructor(private auth: AuthenticationService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private headerService: HeaderService) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      suche: [''],
  });
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  get f() { return this.searchForm.controls; }

  sendSearch() {
    return this.headerService.sendSearch(this.f.suche.value).subscribe( data => {},
      error => {
       if (error && error.error && error.error.err) {
       this.alertService.error(error.error.err);
       } else {
         this.alertService.error('Backend down');
       }
   });
  }
}
