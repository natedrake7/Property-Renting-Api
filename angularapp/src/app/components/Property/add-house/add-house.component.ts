import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormGroup,FormControl, Validators } from '@angular/forms';
import { HouseService } from 'src/app/services/house.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { error } from 'src/app/interfaces/error';
import * as FormData from 'form-data';

@Component({
  selector: 'app-add-house',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create House Listing</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./add-house.component.css">
</head>

<body>
  <div class="container">
    <div class="left-buttons">
      <a routerLink="../">
        <button class="btn btn-primary profile-button" type="button">Back</button>
      </a>
    </div>

    <section class="create-house-listing">
      <form [formGroup]="HouseForm" (submit)="AddPropertyListing()">
        <div class="row">
          <div class="col-md-6">
            <h2>General Information</h2>
            <div class="form-group">
              <label for="house-name">Your House name</label>
              <input id="house-name" class="form-control" type="text" placeholder="Enter your house name" formControlName="Name">
            </div>
            <div class="error" *ngIf="Name_Error">
              <div *ngFor="let message of Name_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="house-summary">Summary</label>
              <textarea
                    id="house-summary"
                    class="form-control"
                    rows="4"
                    formControlName="Summary"
                    placeholder="Enter your summary of the house"
              ></textarea>
            </div>
            <div class="error" *ngIf="Summary_Error">
              <div *ngFor="let message of Summary_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="house-space">Space</label>
              <textarea
                    id="house-space"
                    class="form-control"
                    rows="4"
                    formControlName="Space"
                    placeholder="Describe the space of the house"
              ></textarea>
            </div>
            <div class="error" *ngIf="Space_Error">
              <div *ngFor="let message of Space_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="experiences-offered">Available Experiences</label>
              <textarea
                    id="experiences-offered"
                    class="form-control"
                    rows="4"
                    formControlName="ExperiencesOffered"
                    placeholder="List available experiences"
              ></textarea>
            </div>
            <div class="error" *ngIf="ExperiencesOffered_Error">
              <div *ngFor="let message of ExperiencesOffered_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="country">Country</label>
              <input id="country" class="form-control" type="text" placeholder="Enter the country where your house is" formControlName="Country">
            </div>
            <div class="error" *ngIf="Country_Error">
              <div *ngFor="let message of Country_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="state">State</label>
              <input id="state" class="form-control" type="text" placeholder="Enter the state of your house" formControlName="State">
            </div>
            <div class="error" *ngIf="State_Error">
              <div *ngFor="let message of State_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="country-code">CountryCode</label>
              <input id="country-code" class="form-control" type="text" placeholder="Enter the country code (e.g. GR)" formControlName="CountryCode">
            </div>
            <div class="error" *ngIf="CountryCode_Error">
              <div *ngFor="let message of CountryCode_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="city">City</label>
              <input id="city" class="form-control" type="text" placeholder="Enter the city where your house is" formControlName="City">
            </div>
            <div class="error" *ngIf="City_Error">
              <div *ngFor="let message of City_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="street">Street Address</label>
              <input id="street" class="form-control" type="text" placeholder="Enter the street address of your house" formControlName="Street">
            </div>
            <div class="error" *ngIf="Street_Error">
              <div *ngFor="let message of Street_Error.Errors">
                <p>{{message}}</p>
              </div>
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
            <div class="row">
          <div class="col">
            <h2>Images</h2>
            <div class="form-group">
              <label for="thumbnail">Upload Thumbnail</label>
              <input id="thumbnail" class="form-control" type="file" (change)="OnImageUpload($event)" accept="image/*">
              <div class="error" *ngIf="Thumbnail_Error">
                <div *ngFor="let message of Thumbnail_Error.Errors">
                  <p>{{message}}</p>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="images-etc">Upload the rest of the images</label>
              <input id="images-etc" class="form-control" type="file" (change)="OnImagesUpload($event)" accept="image/*" multiple>
              <div class="error" *ngIf="Images_Error">
                <div *ngFor="let message of Images_Error.Errors">
                  <p>{{message}}</p>
                </div>
              </div>
            </div>
          </div>
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
                  <div class="error" *ngIf="Bathrooms_Error">
                    <div *ngFor="let message of Bathrooms_Error.Errors">
                      <p>{{message}}</p>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="beds">Beds</label>
                    <input id="beds" class="form-control" type="number" formControlName="Beds">
                  </div>
                  <div class="error" *ngIf="Beds_Error">
                    <div *ngFor="let message of Beds_Error.Errors">
                      <p>{{message}}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="bedrooms">Bedrooms</label>
                    <input id="bedrooms" class="form-control" type="number" formControlName="Bedrooms">
                  </div>
                  <div class="error" *ngIf="Bedrooms_Error">
                    <div *ngFor="let message of Bedrooms_Error.Errors">
                      <p>{{message}}</p>
                    </div>
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
                    <div class="error" *ngIf="PropertyType_Error">
                      <div *ngFor="let message of PropertyType_Error.Errors">
                        <p>{{message}}</p>
                      </div>
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
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </section>

  </div>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>
  `,
  styleUrls: ['./add-house.component.css']
})
export class AddHouseComponent {
  //Services
  HouseService = inject(HouseService);
  UserService = inject(UserService);
  RoutingService = inject(Router);

  //Errors
  imageError: string | undefined;
  Thumbnail_Error: error | undefined;
  Images_Error: error | undefined;
  Name_Error: error | undefined;
  City_Error: error | undefined;
  Space_Error: error | undefined;
  State_Error: error | undefined;
  Street_Error: error | undefined;
  Country_Error: error|undefined
  Summary_Error: error | undefined;
  CountryCode_Error: error | undefined;
  PropertyType_Error: error | undefined;
  ExperiencesOffered_Error: error | undefined;
  Bedrooms_Error: error | undefined;
  Bathrooms_Error: error | undefined;
  Beds_Error: error | undefined;

  //Variables
  images: File[] = [];
  User: User | undefined;
  Thumbnail: File | undefined;
  PropertyOptions = ["Apartment","House","Villa","Motel","Hotel"];
  CancellationPolicyOptions = ["None","Strict"];
  TransitOptions = ["None","Metro","Bus","Metro and Bus"];
  GeneralOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  //Data form
  HouseForm = new FormGroup({
    Name: new FormControl('',Validators.required),
    Summary: new FormControl('',Validators.required),
    Space: new FormControl('',Validators.required),
    ExperiencesOffered: new FormControl('',Validators.required),
    NeighborhoodOverview: new FormControl('',Validators.required),
    Notes: new FormControl('',Validators.required),
    Transit: new FormControl('None',Validators.required),
    Street: new FormControl('',Validators.required),
    Neighborhood: new FormControl('',Validators.required),
    City: new FormControl('',Validators.required),
    State: new FormControl('',Validators.required),
    Zipcode: new FormControl('',Validators.required),
    Market: new FormControl('',Validators.required),
    CountryCode: new FormControl('',Validators.required),
    Country: new FormControl('',Validators.required),
    IsLocationExact: new FormControl(true),
    PropertyType: new FormControl('',Validators.required),
    Bathrooms: new FormControl(0,Validators.required),
    Bedrooms: new FormControl(0,Validators.required),
    Beds: new FormControl(0,Validators.required),
    SquareFeet: new FormControl(0,Validators.required),
    Price: new FormControl(0,Validators.required),
    WeeklyPrice: new FormControl(0,Validators.required),
    MonthlyPrice: new FormControl(0,Validators.required),
    CleaningFee: new FormControl(0,Validators.required),
    ExtraPeople: new FormControl(0,Validators.required),
    MinimumNights: new FormControl(1,Validators.required),
    MaximumNights: new FormControl(0,Validators.required),
    RequiresLicense: new FormControl(false),
    InstantBookable: new FormControl(true),
    RequireGuestPhoneVerification: new FormControl(false),
    CancellationPolicy: new FormControl('None',Validators.required)
  });

  constructor(){
    this.User = this.UserService.GetUserData();
  }

  AddPropertyListing(){
    const ListingData = this.GetData();
    this.HouseService.CreateProperty(ListingData).subscribe((response) => {
      if(response === 'ok'){
        this.RoutingService.navigate(["/Profile/Host"]).then(() => location.reload());
      }
      else{
        const Error = response as error[];
        this.Thumbnail_Error = Error.find(item => item.Variable === 'Thumbnail');
        this.Images_Error = Error.find(item => item.Variable === 'Images');
        this.Name_Error = Error.find(item => item.Variable === 'Name');
        this.City_Error = Error.find(item => item.Variable === 'City');
        this.Space_Error = Error.find(item => item.Variable === 'Space');
        this.State_Error = Error.find(item => item.Variable === 'State');
        this.Street_Error = Error.find(item => item.Variable === 'Street');
        this.Country_Error = Error.find(item => item.Variable === 'Country');
        this.CountryCode_Error = Error.find(item => item.Variable === 'CountryCode');
        this.Summary_Error = Error.find(item => item.Variable === 'Summary');
        this.PropertyType_Error = Error.find(item => item.Variable === 'PropertyType');
        this.ExperiencesOffered_Error = Error.find(item => item.Variable === 'ExperiencesOffered');
        this.Bathrooms_Error = Error.find(item => item.Variable === 'Bathrooms');
        this.Bedrooms_Error = Error.find(item => item.Variable === 'Bedrooms');
        this.Beds_Error = Error.find(item => item.Variable === 'Beds');
      }
    });

  }
  OnImageUpload(event:any){
    const file = event.target.files[0];
    if (file) {
      this.Thumbnail = file; 
    } else {
      this.imageError = 'No image selected.';
    }
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
  GetData():FormData{
    const formValue = this.HouseForm.value;
    const ListingData = new FormData();
    ListingData.append('Name',formValue.Name || '');
    ListingData.append('Summary',formValue.Summary);
    ListingData.append('Space',formValue.Space || '');
    ListingData.append('ExperiencesOffered',formValue.ExperiencesOffered || '');
    ListingData.append('Notes',formValue.Notes || '');
    ListingData.append('Transit',formValue.Transit);
    ListingData.append('Street',formValue.Street || '');
    ListingData.append('Neighborhood',formValue.Neighborhood || '');
    ListingData.append('NeighborhoodOverview',formValue.NeighborhoodOverview || '');
    ListingData.append('City',formValue.City || '');
    ListingData.append('State',formValue.State || '');
    ListingData.append('ZipCode',formValue.Zipcode || '');
    ListingData.append('Market',formValue.Market || '');
    ListingData.append('CountryCode',formValue.CountryCode || '');
    ListingData.append('Country',formValue.Country || '');
    ListingData.append('IsLocationExact',formValue.IsLocationExact);
    ListingData.append('PropertyType', formValue.PropertyType || '');
    ListingData.append('Bathrooms',formValue.Bathrooms);
    ListingData.append('Bedrooms',formValue.Bedrooms);
    ListingData.append('Beds',formValue.Beds);
    ListingData.append('SquareFeet',formValue.SquareFeet);
    ListingData.append('Price',formValue.Price);
    ListingData.append('WeeklyPrice',formValue.WeeklyPrice);
    ListingData.append('MonthlyPrice',formValue.MonthlyPrice);
    ListingData.append('CleainingFee',formValue.CleaningFee);
    ListingData.append('ExtraPeople',formValue.ExtraPeople);
    ListingData.append('MinimumNights',formValue.MinimumNights);
    ListingData.append('MaximumNights',formValue.MaximumNights);
    ListingData.append('RequiresLicense',formValue.RequiresLicense);
    ListingData.append('InstantBookable',formValue.InstantBookable);
    ListingData.append('RequireGuestPhoneVerification',formValue.RequireGuestPhoneVerification);
    ListingData.append('CancellationPolicy',formValue.CancellationPolicy);
    ListingData.append('Thumbnail',this.Thumbnail!);
    for(let i = 0;i < this.images.length!;i++){
      ListingData.append('Images',this.images[i]);
    }
    return ListingData;
  }
}
