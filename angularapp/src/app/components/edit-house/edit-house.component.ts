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
    <div class="left-buttons">
      <a routerLink="../../">
        <button class="profile-button" type="button">Back</button>
      </a>
    </div>
    <section class='create-house-listing'>
      <form [formGroup]="HouseForm" (submit)="EditListing()">
      <div class="listing">
      <label for="house-name">Your House name</label>
        <input id="house-name" type="text" [placeholder]="House?.Name" formControlName="Name">
      <label for="house-summary">Summary</label>
        <input id="house-name" type="text" [placeholder]="House?.Summary" formControlName="Summary">
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
        <input id="location-exact" type="checkbox" formControlName="IsLocationExact">
      </div>
      <div class = "experiences">
        <label for="bathrooms">Bathrooms</label>
          <input id="bathrooms" type="number" formControlName="Bathrooms">
        <label for="bedrooms">Bedrooms</label>
        <input id="bedrooms" type="number" formControlName="Bedrooms"> 
      <label for="beds">Beds</label>
        <input id="beds" type="number" formControlName="Beds">              
    </div>
    <div class = "property">
      <label for="property-type">Property Type</label>
          <input id="property-type" type="text" placeholder="Enter the type of property (e.g. appartment)" formControlName="PropertyType">
      <label for="square-feet">Property Size</label>
          <input id="square-feet" type="number" formControlName="SquareFeet">
    </div>
    <div class="etc">
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
        <input id="transit" type="text" placeholder="Enter the available tranists,leave blank if none" formControlName="Transit">
      <label for="license">Check if driver's license is required in the area</label>
         <input id="license" type="checkbox" formControlName="RequiresLicense">
      <label for="instantly-bookable">Check if the property can be instantly booked</label>
         <input id="instantly-bookable" type="checkbox" formControlName="InstantBookable">
      <label for="phone-verification">Check if guest must verify the booking by phone</label>
         <input id="phone-verification" type="checkbox" formControlName="RequireGuestPhoneVerification">
       <label for="cancellation-policy">Cancellation policy</label>
         <input id="cancellation-policy" type="text" placeholder="Specify your cancellation policy" formControlName="CancellationPolicy">
    </div>
      <div class="add-images">
        <label for="image-upload">Add Images</label>
        <input id="image-upload" type="file" (change)="OnImagesUpload($event)" accept="image/*" multiple>
      </div>
      <button type="submit" class="primary">Submit</button>
    </form>
    <div class="image-slider">
      <div class="image-container">
        <img [src]="currentImage" alt="Image">
      </div>
      <div class="navigation-buttons">
        <button class="btn btn-primary" (click)="previousImage()">&lt;</button>
        <button class="btn btn-primary" (click)="nextImage()">&gt;</button>
        <button class="btn btn-danger" (click)="DeleteImage()">Delete Image</button>
        <div class="error" *ngIf="DeleteError">
          <p> {{DeleteError}} </p>
        </div>
        <button class="btn btn-success" (click)="SetAsThumbnail()">Set as Thumbnail</button>
      </div>
    </div>
    </section>
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
