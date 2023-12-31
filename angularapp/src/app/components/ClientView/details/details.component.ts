import { Component,inject } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HouseService } from 'src/app/services/house.service';
import { House} from 'src/app/interfaces/house';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Images } from 'src/app/interfaces/images';
import { HostService } from 'src/app/services/host.service';
import { Host } from 'src/app/interfaces/host';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from 'src/app/services/user.service';
import * as FormData from 'form-data';
import { MatDialogModule } from '@angular/material/dialog';
import { error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatSelectModule,MatIconModule,MatDialogModule],
  providers: [DatePipe],
  template: `
    
  <div class="container layout">
    <div class="row">
      <div class="listing-description">
            <h3 class="listing-heading">{{housingLocation?.Name}}</h3>
            <p class="listing-location">
              <span class="star-rating"> 
                <i class="fas fa-star"></i> 
                {{housingLocation?.ReviewScoresRating}},
              </span>
              {{housingLocation?.City}}, {{housingLocation?.State}},{{housingLocation?.Country}}
            </p>
      </div>
      <div class="col-md-6">
        <div class="image-container">
          <div class="image-wrapper">
              <img [src]="currentImage" alt="Image">
              <div class="navigation-buttons">
                <button class="btn btn-primary left-button" type="button" (click)="previousImage()">&lt;</button>
                <button class="btn btn-primary right-button" type="button" (click)="nextImage()">&gt;</button>
              </div>
          </div>
        </div>
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <h2>                  
            <span class="image">
              <img class="property-image" src="../../../assets/property.png" alt="logo" aria-hidden="true">
            </span>
            Experiences Offered
          </h2>
          <p *ngIf="housingLocation?.ExperiencesOffered">
            {{housingLocation?.ExperiencesOffered}}
          </p>
          <p *ngIf="!housingLocation?.ExperiencesOffered">
            Please contact the host to receive the available experiences of the property.
          </p>
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <h2>About the Host <span class="host-pic">
              <a [routerLink]="['../PreviewHost',Host?.Id]">
                <img class="profile-pic" [src]="ProfilePic?.URL">
              </a>
            </span>
          </h2>
          <h5>Host Name</h5>
            <p>{{Host?.HostName}}</p>
          <h5>Host Location</h5>
            <p>{{Host?.HostLocation}} <span class="host-location"> 
              <a href="https://www.google.com/maps/search/?api=1&query={{Host?.HostLocation}}" target="_blank">
                <img class="maps-link"src="../../../../assets/google_maps.png" alt="Link to Address" />
            </a>
            </span>
          </p>
          <h5>Host Biography</h5>
            <p>{{Host?.HostAbout}}</p>
          <p>Learn More about the host <a [routerLink]="['../PreviewHost',Host?.Id]">here</a>
      </div>
      <div class="col-md-6">
        <section class="listing-features">
          <h2 class="section-heading">{{housingLocation?.PropertyType}}. Host: <span class="host-name">{{ Host?.HostName }} </span></h2>
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <div class="row">
            <div class="col-md-4">
              <div class="listing-block">
                <p class="house-accomodates">
                  <span class="image">
                    <img class="image" src="../../../assets/bed.png" alt="logo" aria-hidden="true">
                  </span>
                  <span class="bedrooms">
                    {{housingLocation?.Bedrooms}} Bedrooms,
                  </span>
                  <span class="beds">
                    {{housingLocation?.Beds}} Beds
                  </span>
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="listing-block">
                <p class="house-accomodates">
                  <span class="image">
                    <img class="image" src="../../../assets/shower3.png" alt="logo" aria-hidden="true">
                  </span>
                  <span class="baths">
                      {{housingLocation?.Bathrooms}} Bathrooms
                  </span>
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="listing-block">
                <p class="house-accomodates">
                  <span class="image">
                    <img class="image" src="../../../assets/transit.png" alt="logo" aria-hidden="true">
                  </span>
                  <span class="transit">
                     {{housingLocation?.Transit}}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <div class="row">
            <div class="property-type">
              <h5>Property Type: {{housingLocation?.PropertyType}}</h5>
              <p *ngIf="housingLocation?.PropertyType === 'Apartment'">
                Your own apartment in a complex,with access to the shared areas.
              </p>
              <p *ngIf="housingLocation?.PropertyType === 'Villa'">
                Your own Villa with access to all of its luxuries.
              </p>
              <p *ngIf="housingLocation?.PropertyType === 'House'">
                Your own House with access to all of the estate.
              </p>
              <p *ngIf="housingLocation?.PropertyType === 'Hotel'">
                Your own hotel room with access to the whole hotel and its services.
              </p>
              <p *ngIf="housingLocation?.PropertyType === 'Motel'">
                Your own motel room with access to the whole motel and its services.
              </p>
            </div>
            <div class="cancellation-policy">
              <h5>Cancellation Policy: {{housingLocation?.CancellationPolicy}}</h5>
              <p *ngIf="housingLocation?.CancellationPolicy === 'None'">
                You can cancel your reservation anytime you want.
              </p>
              <p *ngIf="housingLocation?.CancellationPolicy === 'Strict'">
                Please contact the host to receive more information about the cancellation date.
              </p>
            </div>
          </div>
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <h2>About This Property</h2>
          <div class="row">
          <p>{{housingLocation?.Summary}}</p>
          <h5>The Space</h5>
          <p>{{housingLocation?.Space}}</p>
          <h5>The Neighborhood: {{housingLocation?.Neighbourhood}}</h5>
          <div *ngIf="housingLocation?.NeighborhoodOverview">
            <p>{{housingLocation?.NeighborhoodOverview}}</p>
          </div>
          <div *ngIf="!housingLocation?.NeighborhoodOverview">
            <p>Contact the host to receive more information about the neighbourhood.</p>
          </div>
          <h5>Find us on Google Maps  <a href="https://www.google.com/maps/search/?api=1&query={{housingLocation?.Street}},{{housingLocation?.Neighbourhood}},{{housingLocation?.City}}" target="_blank">
                <img class="maps-link"src="../../../../assets/google_maps.png" alt="Link to Address" />
            </a></h5>
          </div>
        </section>
        <hr style="border: 1px solid gray;border-radius: 12px;">
        <div class="row">
          <div class="book">
            <h5>{{housingLocation?.Price}}€
              <span class="price">/Night</span>
              <span class="ratings"> 
                {{housingLocation?.ReviewScoresRating}}
                <i class="fas fa-star"></i> 
              </span>
              </h5>
                <div class="col-md-6">
                    <mat-form-field class="calendar">
                      <mat-label>Enter a date range</mat-label>
                      <mat-date-range-input [formGroup]="BookDates" [rangePicker]="picker" [dateFilter]="BoundFunc">
                        <input matStartDate  formControlName="start" placeholder="Start date">
                        <input matEndDate formControlName="end" placeholder="End date">
                      </mat-date-range-input>
                      <mat-datepicker-toggle  matIconSuffix [for]="picker"></mat-datepicker-toggle>
                      <mat-date-range-picker #picker ></mat-date-range-picker>
                      <mat-error *ngIf="BookDates.controls.start.hasError('matStartDateInvalid')">Invalid start date</mat-error>
                      <mat-error *ngIf="BookDates.controls.end.hasError('matEndDateInvalid')">Invalid end date</mat-error>
                    </mat-form-field>
                    <div class ="error"*ngIf="StartingDate_Error">
                      <p>{{StartingDate_Error.Errors}}</p>
                    </div>
                    <div class ="error"*ngIf="EndingDate_Error">
                      <p>{{EndingDate_Error.Errors}}</p>
                    </div>
                    <div class="form-group" [formGroup]="Visitors">
                      <mat-form-field appearance="fill" class="tenant-group">
                        <mat-select id="tenants" class="tenants" formControlName="Count" placeholder="Visitors">
                          <mat-option *ngFor="let option of VisitorOptions" [value]="option">{{ option }}</mat-option>
                        </mat-select>
                        <mat-icon matSuffix></mat-icon>
                      </mat-form-field>
                    </div>
                    <div class ="error"*ngIf="Visitors_Error">
                      <p>{{Visitors_Error.Errors}}</p>
                    </div>
                    <div *ngIf="ShowTotalCost()">
                        <h5>Total Cost: 
                          <p class="total-cost">
                            {{TotalCost()}}€ for {{GetNumberOfDays()}} nights ({{TotalCost()/GetVisitors()}}€ per visitor).
                          </p></h5>
                    </div>
              </div>
              <div class="col-md-6">
                <button class="btn btn-primary book-button" (click)="ShowForm()">Book Now!</button>
              </div>
              <div *ngIf="SumbitForm">
                <hr style="border: 1px solid gray;border-radius: 12px;">
                  <div *ngIf="this.UserService.GetUserStatus()">
                    <h5 class="sumbit">
                      <span class="submit">Submit as current user?</span>
                    </h5>
                    <div class="submit-buttons">
                      <button class="btn btn-primary submit-button-1" (click)="BookProperty()">Yes</button>
                      <button class="btn btn-primary submit-button-2" (click)="LogoutConfirm()">No</button>
                    </div>
                    <div class="logout" *ngIf="LogoutBoolean">
                      <p class="logout">
                        Please <a (click)="Logout()">Logout</a> and login as the appropriate user.
                      </p>
                    </div>
                  </div>
                  <div *ngIf="!this.UserService.GetUserStatus()">
                    <div class="col-md-6">
                      <p class="login"> <a routerLink="../../Login"> Please Login to continue</a></p>
                      <p  class="register"> <a routerLink="../../Register">Not a user? Register now!</a></p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <div class="row review-box">
            <h5 class="review-header">Have you been here?Leave a review.</h5>
            <form [formGroup]="Review" (ngSubmit)="SubmitReview()">
              <div class="form-group">
                  <textarea
                    id="reviewText"
                    class="form-control"
                    rows="4"
                    formControlName="Text"
                    placeholder="Please review the property..."
                  ></textarea>
              </div>
              <div class ="error"*ngIf="ReviewText_Error">
                <p>{{ReviewText_Error.Errors}}</p>
              </div>
              <div class="row">
              <div class="col-md-3">
                  <div class="form-group">
                    <label for="rating">Rating</label>
                    <div class ="rating-container">
                      <select id="rating" class="form-control" formControlName="Rating">
                        <option *ngFor="let option of RatingOptions" [value]="option">{{ option }}</option>
                      </select>
                      <div class="rating-arrow">&#9660;</div>
                    </div>
                  </div>
                  <div class ="error"*ngIf="ReviewRating_Error">
                    <p>{{ReviewRating_Error.Errors}}</p>
                  </div>
                  <div class="form-group">
                    <label for="rating">Communication</label>
                    <div class ="rating-container">
                      <select id="rating" class="form-control" formControlName="Communication">
                        <option *ngFor="let option of RatingOptions" [value]="option">{{ option }}</option>
                      </select>
                      <div class="rating-arrow">&#9660;</div>
                    </div>
                  </div>
                  <div class ="error"*ngIf="ReviewCommunication_Error">
                    <p>{{ReviewCommunication_Error.Errors}}</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="rating">Cleaniness</label>
                    <div class ="rating-container">
                      <select id="rating" class="form-control" formControlName="Cleaniness">
                        <option *ngFor="let option of RatingOptions" [value]="option">{{ option }}</option>
                      </select>
                      <div class="rating-arrow">&#9660;</div>
                    </div>
                  </div>
                  <div class ="error"*ngIf="ReviewClean_Error">
                    <p>{{ReviewClean_Error.Errors}}</p>
                  </div>
                  <div class="form-group">
                    <label for="rating">Location</label>
                    <div class ="rating-container">
                      <select id="rating" class="form-control" formControlName="Location">
                        <option *ngFor="let option of RatingOptions" [value]="option">{{ option }}</option>
                      </select>
                      <div class="rating-arrow">&#9660;</div>
                    </div>
                  </div>
                  <div class ="error"*ngIf="ReviewLocation_Error">
                    <p>{{ReviewLocation_Error.Errors}}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <button type="submit" class="btn btn-primary review-button">Submit Review</button>
                </div>
              </div>
            </form>
            <div class ="error"*ngIf="ReviewUser_Error">
              <p>{{ReviewUser_Error.Errors}}</p>
            </div>
        </div>    
    </div>
    <hr style="border: 1px solid gray;border-radius: 12px;">
    <div class="row">
      <h5>Some of the property's reviews:</h5>
      <div class="reviews-container">
        <div *ngFor="let review of housingLocation?.Reviews">
          <div class="reviews">
            <div class="review-contents">
              <h5 class="reviewer-name">{{review.ReviewerName}}, <span class="date"> Date: {{ review.Date | date: 'dd/MM/yyyy' }}</span></h5>
              <p class="review-comments">{{review.Comments}}</p>
                <div class="score">Property: <span class="review-rating">{{review.ReviewScoresRating}}<i class="fas fa-star"></i></span></div>
                <div class="score"> Location: <span class="review-rating">{{review.ReviewScoresLocation}}<i class="fas fa-star"></i></span></div>
                <div class="score"> Host communication: <span class="review-rating">{{review.ReviewScoresCommunication}}<i class="fas fa-star"></i></span></div>
                <div class="score">Cleaninless: <span class="review-rating">{{review.ReviewScoresCleanliness}}<i class="fas fa-star"></i></span></div>        
            </div>
          </div>
        </div>
      </div>
    </div>
</div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  public startDate: Date = new Date(Date.now());
  housingService = inject(HouseService);
  route: ActivatedRoute = inject(ActivatedRoute);
  HostService: HostService = inject(HostService);
  UserService: UserService = inject(UserService);
  StartingDate_Error: error;
  EndingDate_Error: error;
  Visitors_Error: error;
  ReviewUser_Error: error;
  ReviewText_Error: error | undefined;
  ReviewRating_Error: error | undefined;
  ReviewClean_Error: error | undefined;
  ReviewCommunication_Error: error | undefined;
  ReviewLocation_Error: error | undefined;
  housingLocationId = -1;
  currentIndex = 0;
  housingLocation: House | undefined;
  Images: Images[] = [];
  Host: Host | undefined;
  ProfilePic: Images | undefined;
  BookedDates:string[] = [];
  VisitorOptions = [1,2,3,4,5];
  RatingOptions = [1,2,3,4,5];
  SumbitForm : boolean = false;
  LogoutBoolean:boolean = false;
  BookDates = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  Visitors = new FormGroup({
    Count: new FormControl(0)
  });
  Review = new FormGroup({
    Rating: new FormControl(-1),
    Cleaniness: new FormControl(-1),
    Communication: new FormControl(-1),
    Location: new FormControl(-1),
    Text: new FormControl('')
  });
  
  constructor() {
    this.StartingDate_Error = {Variable: '',Errors: ''};
    this.EndingDate_Error = {Variable: '',Errors: ''};
    this.Visitors_Error = {Variable: '',Errors: ''};
    this.ReviewUser_Error = {Variable: '',Errors: ''};
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).subscribe(housingLocation => {
        this.housingLocation = housingLocation;
        this.housingService.GetPropertyDates(housingLocation.Id).subscribe( response => {
          if(typeof response != "string")
          {
            this.BookedDates = response;
          }
          this.HostService.RetrivePublicHostDatabyId(this.housingLocation?.HostId!).subscribe((host) =>{
             this.Host = host;
              this.HostService.RetrieveHostImageById(this.housingLocation?.HostId!).subscribe((image) =>{
                this.ProfilePic = image;
                });
              })
        })
  });
  }
  /*Image preview functions*/

  get currentImage(): string{
    const currentImage = this.housingLocation?.Images[this.currentIndex]?.URL ?? '';
    return currentImage;
  }

  previousImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.housingLocation!.Images.length) % this.housingLocation!.Images?.length;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.housingLocation!.Images?.length;
  }

 /*Submit Review*/

  SubmitReview(){
    const Data = new FormData();
    const Review = this.Review.value;
    Data.append('Rating',Review.Rating);
    Data.append('Cleaniness',Review.Cleaniness);
    Data.append('Communication',Review.Communication);
    Data.append('Location',Review.Location);
    Data.append('Text',Review.Text);
    this.housingService.SumbitReview(this.housingLocation?.Id,Data).subscribe((response) => {
      console.log(response);
      if(response === 'UserError')
      {
        this.ReviewUser_Error.Variable = "User";
        this.ReviewUser_Error.Errors = "You must have booked this property in the past or be an authenticated user to submit a review!";
      }
      else if(response != "ok")
      {
        const Errors = response as error[];
        this.ReviewText_Error = Errors.find(item => item.Variable === 'Text');
        this.ReviewRating_Error = Errors.find(item => item.Variable === 'Rating');
        this.ReviewClean_Error = Errors.find(item => item.Variable === 'Cleaniness');
        this.ReviewCommunication_Error = Errors.find(item => item.Variable === 'Communication');
        this.ReviewLocation_Error = Errors.find(item => item.Variable === 'Location');
      }
      else
        location.reload();
    })
  }
  /*Submit Form function*/

  ShowForm(){
    const Date = this.BookDates.value;
    const Visitors = this.Visitors.value;
    var error = false;
    if(Date.start === null){
      error = true;
      this.StartingDate_Error!.Variable = "start"
      this.StartingDate_Error!.Errors = "Please select a starting date";
    }
    else{
      this.StartingDate_Error!.Variable = ""
      this.StartingDate_Error!.Errors = "";
    }

    if(Date.end === null){
      error = true;
      this.EndingDate_Error!.Variable = "end"
      this.EndingDate_Error!.Errors = "Please select an ending date";
    }
    else{
      this.EndingDate_Error!.Variable = ""
      this.EndingDate_Error!.Errors = "";
    }

    if(Visitors.Count === 0){
      error = true;
      this.Visitors_Error!.Variable = "visitors";
      this.Visitors_Error!.Errors = "Please select the number of visitors";
    }
    else{
      this.Visitors_Error!.Variable = "";
      this.Visitors_Error!.Errors = ""
    }

    if(!error)
      this.SumbitForm = !this.SumbitForm;
  }

  ShowTotalCost():boolean{
    const Dates = this.BookDates.value;
    const Visitors = this.Visitors.value;
    if(Dates.start && Dates.end && Visitors.Count)
      return true;
    return false;
  }

  TotalCost():number{
    const Days = this.GetNumberOfDays();
    const Visitors = this.Visitors.value;
    return this.housingLocation!.Price*Visitors.Count!*Days;
  }

  GetNumberOfDays():number{
    const Dates = this.BookDates.value;
    const Days = (Dates.end!.getTime() - Dates.start!.getTime()) / (1000 * 3600 * 24);
    return Days;
  }

  GetVisitors():number{
    return this.Visitors.value.Count!;
  }

  BookProperty(){
    const Data = new FormData();
    const Date = this.BookDates.value;
    const Visitors = this.Visitors.value;
    Data.append('StartDate',Date.start!.toISOString());
    Data.append('EndDate',Date.end!.toISOString());
    Data.append('VisitorsCount',Visitors.Count);
    Data.append('TotalPrice',this.TotalCost());
    Data.append('DaysCount',this.GetNumberOfDays());
    this.housingService.BookPropertyById(this.housingLocation?.Id,Data).subscribe(response =>{
      if(response === "ok")
        location.reload();
    });
  }

  FilterDate(date:Date):boolean{
    if(date <= new Date(Date.now()))
      return false;
    if(this.BookedDates.find(bookeddate => bookeddate.slice(0,10) === date.toISOString().slice(0,10)))
      return false;
    return true;
  }

  LogoutConfirm(){this.LogoutBoolean = !this.LogoutBoolean;}
  Logout(){
    if (this.UserService.GetUserStatus())
      this.UserService.Logout().subscribe(() => { localStorage.removeItem('User'); location.reload(); });
  }
  BoundFunc = this.FilterDate.bind(this);
}
