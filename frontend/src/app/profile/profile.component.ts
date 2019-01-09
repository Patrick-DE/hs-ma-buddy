import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { AlertService } from '../alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Products, ProductsService } from '../products/products.service';
import { Dealer } from '../dealers/dealer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loadet = false;
  profile = false;
  buddyid;
  myProfile;
  availableForm: FormGroup;
  edit = false;
  reason = false;
  isAvailable = false;
  products: Products[];
  constructor( private profileService: ProfileService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private productService: ProductsService) {
   }

  ngOnInit() {
    this.getMe();
  }
  available() {
    if (this.myProfile.available === true) {
      this.reason = true;
    } else {
      this.reason = false;
      this.changeAvailable(this.myProfile);
    }
    this.availableForm = this.formBuilder.group({
      grund: ['', Validators.required]
  });
  }

  get grund() { return this.availableForm.controls; }




  changeAvailable(profile: Dealer) {
    if (profile.available === false) {
      profile.available = true;
      profile.away_reason = '';
    } else {
    const available = profile.available === true ? false : true;
    profile.available = available;
    profile.away_reason = this.grund.grund.value;
    }
    this.profileService.updateProfile(profile).subscribe( data => {
      this.isAvailable = false;
      this.getMyProfile(profile._id);

    }, error => {
      if (error.error.err) {
      this.alertService.error(error.error.err);
      } else {
        this.alertService.error(error);
      }
    }
      );
  }
  editProfile() {
    this.edit = true;
  }
  getMyProfile(id: String) {
    this.profileService.myProfile(id).subscribe(profile => {
      this.myProfile = profile;
    }, error => {
      if (error.error.err) {
      this.alertService.error(error.error.err);
      } else {
        this.alertService.error(error);
      }
    });
  }

  getMe() {
     this.profileService.myUser().subscribe(user => {
      if (user.buddy) {
        this.profile = true;
        this.buddyid = user.buddy;
        this.getMyProfile(user.buddy);
        this.productService.getProducts().subscribe( products => {
         this.products = products;
        });
        this.loadet = true;
      }
      }, error => {
      if (error.error.err) {
      this.alertService.error(error.error.err);
      } else {
        this.alertService.error(error);
      }
    });
  }
}
