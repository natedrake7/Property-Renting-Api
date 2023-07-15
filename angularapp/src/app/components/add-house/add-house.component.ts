import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormGroup,FormControl, Validators, FormsModule } from '@angular/forms';
import { HouseService } from 'src/app/services/house.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { ImageService } from 'src/app/services/image.service';
import { error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-add-house',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
    <div class="left-buttons">
      <a routerLink="../">
        <button class="profile-button" type="button">Back</button>
      </a>
    </div>
    <section class='create-house-listing'>
      <form [formGroup]="HouseForm" (submit)="AddPropertyListing()">
      <div class="listing">
        <h2>General Information</h2>
        <label for="house-name">Your House name</label>
          <input id="house-name" type="text" placeholder="Enter you house name" formControlName="Name">
        <label for="house-summary">Summary</label>
          <input id="house-name" type="text" placeholder="Enter your summary of the house" formControlName="Summary">
        <label for="house-space">Space</label>
          <input id="house-name" type="text" placeholder="Describe the space of the house" formControlName="Space">
        <label for="country">Country</label>
          <input id="country" type="text" placeholder="Enter the country where your house is" formControlName="Country">
        <label for="country-code">CountryCode</label>
          <input id="country-code" type="text" placeholder="Enter the country code (e.g. GR)" formControlName="CountryCode">
        <label for="city">City</label>
          <input id="city" type="text" placeholder="Enter the city where your house is" formControlName="City">
        <label for="street">Street Address</label>
          <input id="street" type="text" placeholder="Enter the street address of your house" formControlName="Street">
        <label for="zipcode">ZipCode</label>
          <input id="zipcode" type="text" placeholder="Enter the zipcode" formControlName="Zipcode">
        <label for="neighborhood">Neighborhood</label>
          <input id="neighborhood" type="text" placeholder="Enter the neighborhood of your house" formControlName="Neighborhood">
        <label for="neighborhood-overview">Neighborhood Overview</label>
          <input id="neighborhood-overview" type="text" placeholder="Describe the Neighborhood" formControlName="NeighborhoodOverview">
        <label for="location-exact">Is Location Exact</label>
          <select id="location-exact" formControlName="IsLocationExact">
              <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
          </select>
      </div>
      <div class = "experiences">
        <h2> Property Accomodations</h2>
        <label for="bathrooms">Bathrooms</label>
          <input id="bathrooms" type="number" formControlName="Bathrooms">
        <label for="bedrooms">Bedrooms</label>
        <input id="bedrooms" type="number" formControlName="Bedrooms"> 
      <label for="beds">Beds</label>
        <input id="beds" type="number" formControlName="Beds">              
    </div>
    <div class = "property">
    <h2> Property Type and Size</h2>
      <label for="property-type">Property Type</label>
      <select id="property-type" formControlName="PropertyType">
            <option *ngFor="let option of PropertyOptions" [value]="option">{{ option }}</option>
         </select>
      <label for="square-feet">Property Size</label>
          <input id="square-feet" type="number" formControlName="SquareFeet">
    </div>
    <div class="etc">
    <h2>Booking and Pricing</h2>
      <label for="price">Daily Price</label>
          <input id="price" type="number" formControlName="Price">
      <label for="weekly-price">Weekly Price</label>
          <input id="weekly-price" type="number" formControlName="WeeklyPrice">
      <label for="monthly-price">Monthly Price</label>
          <input id="monthly-price" type="number"formControlName="MonthlyPrice">
      <label for="cleaning-fee">Cleaning Fee</label>
          <input id="cleaning-fee" type="number" formControlName="CleaningFee">
      <label for="extra-people">Extra People Cost</label>
          <input id="extra-people" type="number" formControlName="ExtraPeople">
      <label for="minimum-nights">Minimum Nights</label>
          <input id="minimum-nights" type="number" formControlName="MinimumNights">
      <label for="maximum-nights">Maximum Nights</label>
          <input id="maximum-nights" type="number"formControlName="MaximumNights">
      <label for="transit">Transit</label>
         <select id="transit" formControlName="Transit">
            <option *ngFor="let option of TransitOptions" [value]="option">{{ option }}</option>
         </select>
      <label for="license">Is driver's license required ?</label>
        <select id="license" formControlName="RequiresLicense">
            <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
         </select>
      <label for="instantly-bookable">Can the property be instantly booked?</label>
        <select id="instantly-bookable" formControlName="InstantBookable">
              <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
        </select>
      <label for="phone-verification">Does it require phone verification for the guest?</label>
        <select id="phone-verification" formControlName="RequireGuestPhoneVerification">
              <option *ngFor="let option of GeneralOptions" [value]="option.value">{{ option.label }}</option>
        </select>
       <label for="cancellation-policy">Cancellation policy</label>
         <select id="cancellation-policy" formControlName="CancellationPolicy">
            <option *ngFor="let option of CancellationPolicyOptions" [value]="option">{{ option }}</option>
         </select>
    </div>
    <div class="images">
      <label for="thumbnail">Upload Thumbnail</label>
      <input id="thumbnail" type="file" (change)="OnImageUpload($event)" accept="image/*">
      <div class="error" *ngIf="Thumbnail_Error">
          <div *ngFor="let message of Thumbnail_Error.Errors">
                <p>{{message}}</p>
        </div>
      </div>
      <label for="images-etc">Upload the rest of the images</label>
      <input id="images-etc" type="file" (change)="OnImagesUpload($event)" accept="image/*" multiple>
      <div class="error" *ngIf="Images_Error">
          <div *ngFor="let message of Images_Error.Errors">
                <p>{{message}}</p>
        </div>
      </div>
    </div>
      <button type="submit" class="primary">Submit</button>
    </form>
    </section>
  `,
  styleUrls: ['./add-house.component.css']
})
export class AddHouseComponent {
  HouseService = inject(HouseService);
  UserService = inject(UserService);
  RoutingService = inject(Router);
  User: User | undefined;
  imageError: string | undefined;
  Thumbnail_Error: error | undefined;
  Images_Error: error | undefined;
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
    const formValue = this.HouseForm.value;
    const Name = formValue.Name || '';
    const Summary = formValue.Summary || '';
    const Space = formValue.Space || '';
    const ExperiencesOffered = formValue.ExperiencesOffered || '';
    const NeighborhoodOverview = formValue.NeighborhoodOverview || '';
    const Notes = formValue.Notes || '';
    const Transit = formValue.Transit || '';
    const Street = formValue.Street || ''
    const Neighborhood = formValue.Neighborhood || '';
    const City = formValue.City || '';
    const State = formValue.State || '';
    const ZipCode = formValue.Zipcode || '';
    const Market = formValue.Market || '';
    const CountryCode = formValue.CountryCode || '';
    const Country = formValue.Country || '';
    const IsLocationExact = formValue.IsLocationExact || false;
    const PropertyType = formValue.PropertyType || '';

    this.HouseService.CreateProperty(this.User?.Id,Name,Summary,this.Thumbnail,this.images).subscribe((response) => {
      console.log(response);
      if(response === 'ok'){
        this.RoutingService.navigate(['/Profile','/Host']);
      }
      else{
        console.log(response);
        const Error = response as error[];
        this.Thumbnail_Error = Error.find(item => item.Variable === 'Thumbnail');
        this.Images_Error = Error.find(item => item.Variable === 'Images');
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
}
