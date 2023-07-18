import { Component,inject,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { error } from 'src/app/interfaces/error';
import { UserService } from 'src/app/services/user.service';
import { HouseService } from 'src/app/services/house.service';
import { RouterModule,Router } from '@angular/router';
import { House } from 'src/app/interfaces/house';
import { Images } from 'src/app/interfaces/images';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-edit-house',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  template: `

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Listing</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./edit-house.component.css">
</head>

<body>
  <div class="container">
    <div class="left-buttons">
      <a routerLink="../../">
        <button class="profile-button" type="button">Back</button>
      </a>
    </div>

    <section class="create-house-listing">
      <form [formGroup]="HouseForm" (submit)="EditListing()">
        <div class="row">
          <div class="col-md-6">
            <h2>General Information</h2>
            <div class="form-group">
              <label for="house-name">Your House name</label>
              <input id="house-name" class="form-control" type="text" placeholder="Enter your house name" formControlName="Name">
            </div>
            <div class="form-group">
              <label for="house-summary">Summary</label>
              <input id="house-summary" class="form-control summary-input" type="text" placeholder="Enter your summary of the house" formControlName="Summary">
            </div>
            <div class="form-group">
              <label for="house-space">Space</label>
              <input id="house-space" class="form-control space-input" type="text" placeholder="Describe the space of the house" formControlName="Space">
            </div>
            <div class="form-group">
              <label for="country">Country</label>
              <input id="country" class="form-control" type="text" placeholder="Enter the country where your house is" formControlName="Country">
            </div>
            <div class="form-group">
              <label for="country-code">CountryCode</label>
              <input id="country-code" class="form-control" type="text" placeholder="Enter the country code (e.g. GR)" formControlName="CountryCode">
            </div>
            <div class="form-group">
              <label for="city">City</label>
              <input id="city" class="form-control" type="text" placeholder="Enter the city where your house is" formControlName="City">
            </div>
            <div class="form-group">
              <label for="street">Street Address</label>
              <input id="street" class="form-control" type="text" placeholder="Enter the street address of your house" formControlName="Street">
            </div>
            <div class="form-group">
              <label for="zipcode">ZipCode</label>
              <input id="zipcode" class="form-control" type="text" placeholder="Enter the zipcode" formControlName="Zipcode">
            </div>
            <div class="form-group">
              <label for="neighborhood">Neighborhood</label>
              <input id="neighborhood" class="form-control" type="text" placeholder="Enter the neighborhood of your house" formControlName="Neighborhood">
            </div>
            <div class="form-group">
              <label for="neighborhood-overview">Neighborhood Overview</label>
              <input id="neighborhood-overview" class="form-control" type="text" placeholder="Describe the Neighborhood" formControlName="NeighborhoodOverview">
            </div>        
              <h2> Upload Images </h2>
                <div class="form-group">
                    <input id="image-upload" type="file" (change)="OnImagesUpload($event)" accept="image/*" multiple>
                </div>
                <h2>Edit Images</h2>
                <div class="image-container">
                    <img [src]="currentImage" alt="Image">
                </div>
                <div class="navigation-buttons">
                  <button class="btn btn-primary" type="button" (click)="previousImage()">&lt;</button>
                  <button class="btn btn-primary" type="button" (click)="nextImage()">&gt;</button>
                  <button class="btn btn-danger"  type="button"(click)="DeleteImage()">Delete Image</button>
                  <div class="error" *ngIf="DeleteError">
                    <p> {{DeleteError}} </p>
                  </div>
                  <button class="btn btn-success" type="button" (click)="SetAsThumbnail()">Set as Thumbnail</button>
              </div>
          </div>
          <div class="col-md-6">
            <h2>Property Accommodations</h2>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="bathrooms">Bathrooms</label>
                    <input id="bathrooms" class="form-control" type="number" formControlName="Bathrooms">
                  </div>
                  <div class="form-group">
                    <label for="beds">Beds</label>
                    <input id="beds" class="form-control" type="number" formControlName="Beds">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="bedrooms">Bedrooms</label>
                    <input id="bedrooms" class="form-control" type="number" formControlName="Bedrooms">
                  </div>
                </div>
              </div>
                <h2>Property Type and Size</h2>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="property-type">Property Type</label>
                      <select id="property-type" class="form-control" formControlName="PropertyType">
                        <option *ngFor="let option of PropertyOptions" [value]="option">{{ option }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="square-feet">Property Size(in square feet)</label>
                      <input id="square-feet" class="form-control" type="number" formControlName="SquareFeet">
                    </div>
                  </div>
                </div>
            <div class="row">
            <h2>Booking and Pricing</h2>
              <div class="col-md-6 custom-col">
                <div class="form-group">
                  <label for="price">Daily Price</label>
                  <input id="price" class="form-control" type="number" formControlName="Price">
                </div>
                <div class="form-group">
                  <label for="weekly-price">Weekly Price</label>
                  <input id="weekly-price" class="form-control" type="number" formControlName="WeeklyPrice">
                </div>
                <div class="form-group">
                  <label for="monthly-price">Monthly Price</label>
                  <input id="monthly-price" class="form-control" type="number" formControlName="MonthlyPrice">
                </div>
                <div class="form-group">
                  <label for="cleaning-fee">Cleaning Fee</label>
                  <input id="cleaning-fee" class="form-control" type="number" formControlName="CleaningFee">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="extra-people">Extra People Cost</label>
                  <input id="extra-people" class="form-control" type="number" formControlName="ExtraPeople">
                </div>
                <div class="form-group">
                  <label for="minimum-nights">Minimum Nights</label>
                  <input id="minimum-nights" class="form-control" type="number" formControlName="MinimumNights">
                </div>
                <div class="form-group">
                  <label for="maximum-nights">Maximum Nights</label>
                  <input id="maximum-nights" class="form-control" type="number" formControlName="MaximumNights">
                </div>
              </div>
                <h2>Other Options</h2>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="license">Is driver's license required?</label>
                      <select id="license" class="form-control" formControlName="RequiresLicense">
                        <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="transit">Transit</label>
                      <select id="transit" class="form-control" formControlName="Transit">
                        <option *ngFor="let option of TransitOptions" [value]="option">{{ option }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="cancellation-policy">Cancellation policy</label>
                      <select id="cancellation-policy" class="form-control" formControlName="CancellationPolicy">
                        <option *ngFor="let option of CancellationPolicyOptions" [value]="option">{{ option }}</option>
                      </select>
                    </div>
                  </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="instantly-bookable">Instantly booked?</label>
                        <select id="instantly-bookable" class="form-control" formControlName="InstantBookable">
                          <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="phone-verification">Required guest phone verification?</label>
                        <select id="phone-verification" class="form-control" formControlName="RequireGuestPhoneVerification">
                          <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="location-exact">Is Location Exact</label>
                        <select id="location-exact" class="form-control" formControlName="IsLocationExact">
                          <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="submit-button">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>        
      </form>
    </section>

  </div>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>
  `,
  styleUrls: ['./edit-house.component.css']
})
export class EditHouseComponent {
  HouseService = inject(HouseService);
  UserService = inject(UserService);
  ImageService = inject(ImageService);
  RoutingService = inject(Router);
  route = inject(ActivatedRoute);
  User: User | undefined;
  House: House | undefined;
  Images: Images[] = [];
  currentIndex = 0;
  imageError: string | undefined;
  DeleteError: string | undefined;
  images: File[] = [];
  Thumbnail: File | undefined;
  PropertyOptions = ["Appartment","House","Villa","Motel","Hotel"];
  CancellationPolicyOptions = ["None","Strict"];
  TransitOptions = ["None","Metro","Bus","Metro and Bus"];
  GeneralOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  HouseForm = new FormGroup({
    Name: new FormControl('',Validators.required),
    Summary: new FormControl('',Validators.required),
    Space: new FormControl('',Validators.required),
    ExperiencesOffered: new FormControl('',Validators.required),
    NeighborhoodOverview: new FormControl('',Validators.required),
    Notes: new FormControl('',Validators.required),
    Transit: new FormControl('',Validators.required),
    Street: new FormControl('',Validators.required),
    Neighborhood: new FormControl('',Validators.required),
    City: new FormControl('',Validators.required),
    State: new FormControl('',Validators.required),
    Zipcode: new FormControl('',Validators.required),
    Market: new FormControl('',Validators.required),
    CountryCode: new FormControl('',Validators.required),
    Country: new FormControl('',Validators.required),
    IsLocationExact: new FormControl(false),
    PropertyType: new FormControl('',Validators.required),
    Bathrooms: new FormControl('',Validators.required),
    Bedrooms: new FormControl('',Validators.required),
    Beds: new FormControl('',Validators.required),
    SquareFeet: new FormControl('',Validators.required),
    Price: new FormControl('',Validators.required),
    WeeklyPrice: new FormControl('',Validators.required),
    MonthlyPrice: new FormControl('',Validators.required),
    CleaningFee: new FormControl('',Validators.required),
    ExtraPeople: new FormControl('',Validators.required),
    MinimumNights: new FormControl('',Validators.required),
    MaximumNights: new FormControl('',Validators.required),
    RequiresLicense: new FormControl(false),
    InstantBookable: new FormControl(false),
    RequireGuestPhoneVerification: new FormControl(false),
    CancellationPolicy: new FormControl('',Validators.required)
  });

  constructor(){
    this.User = this.UserService.GetUserData();
    this.route.params.subscribe(params => {const id = params['id'];
    this.HouseService.getHousingLocationById(id).subscribe((response) => {
        this.House = response;
        this.HouseService.getHousingImagebyId(id).subscribe((response) =>{
          this.Images = response;
        });
    });
  });
  }
    OnImagesUpload(event:any){
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          this.images.push(file);
        }
      }
    }
    EditListing(){
      const EditForm = this.HouseForm.value;
      const Name = EditForm.Name || '';
      const Summary = EditForm.Summary || '';
      this.HouseService.EditHouseById(this.House?.Id,Name,Summary,this.images).subscribe((response) =>{
        if(response === 'ok')
          location.reload();
        else{ //Error handle

        }

      })

    }
    get currentImage(): string {
      return this.Images[this.currentIndex].URL;
    }
  
    previousImage(): void {
      this.currentIndex = (this.currentIndex - 1 + this.Images.length) % this.Images.length;
    }
  
    nextImage(): void {
      this.currentIndex = (this.currentIndex + 1) % this.Images.length;
    }
    DeleteImage(){
      this.ImageService.DeleteImage(this.Images[this.currentIndex].Id).subscribe((response) =>{
        if(response != 'ok')
          this.DeleteError = response;
        else
          location.reload();
      })
    }
    SetAsThumbnail(){
      this.ImageService.SetThumbnail(this.House?.Id,this.Images[this.currentIndex].Id).subscribe(() => {
        location.reload();
      })
    }
  }
