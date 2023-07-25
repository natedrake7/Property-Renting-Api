import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatSelectModule,MatIconModule],
  template: `
  <div class="container layout">
    <div class="row">
      <div class="listing-description">
            <h3 class="listing-heading">{{housingLocation?.Name}}</h3>
            <p class="listing-location">ReviewHere!,{{housingLocation?.City}}, {{housingLocation?.State}},{{housingLocation?.Country}}</p>
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
      </div>
      <div class="col-md-6">
        <section class="listing-features">
          <h2 class="section-heading">{{housingLocation?.PropertyType}}. Host: <span class="host-name">{{ Host?.HostName }}</span></h2>
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
          </div>
        </section>
        <hr style="border: 1px solid gray;border-radius: 12px;">
        <div class="row">
          <div class="book">
            <h5>{{housingLocation?.Price}}€
              <span class="price">/Night</span>
              <span class="ratings"> 
                  Ratings!
              </span>
              </h5>
                <div class="col-md-6">
                    <mat-form-field class="calendar">
                      <mat-label>Enter a date range</mat-label>
                      <mat-date-range-input [formGroup]="BookDates" [rangePicker]="picker" [min]="startDate">
                        <input matStartDate formControlName="start" placeholder="Start date">
                        <input matEndDate formControlName="end" placeholder="End date">
                      </mat-date-range-input>
                      <mat-datepicker-toggle  matIconSuffix [for]="picker"></mat-datepicker-toggle>
                      <mat-date-range-picker #picker ></mat-date-range-picker>
                      <mat-error *ngIf="BookDates.controls.start.hasError('matStartDateInvalid')">Invalid start date</mat-error>
                      <mat-error *ngIf="BookDates.controls.end.hasError('matEndDateInvalid')">Invalid end date</mat-error>
                    </mat-form-field>
                    <div class="form-group" [formGroup]="Visitors">
                      <mat-form-field appearance="fill" class="tenant-group">
                        <mat-select id="tenants" class="tenants" formControlName="Count" placeholder="Visitors">
                          <mat-option *ngFor="let option of VisitorOptions" [value]="option">{{ option }}</mat-option>
                        </mat-select>
                        <mat-icon matSuffix></mat-icon>
                      </mat-form-field>
                    </div>
                    <div *ngIf="ShowTotalCost()">
                        <h5>Total Cost: 
                          <p class="total-cost">
                            {{TotalCost()}}€ for {{GetNumberOfDays()}} days.
                          </p></h5>
                    </div>
              </div>
              <div class="col-md-6">
                <button class="btn btn-primary book-button" (click)="RedirectToBookPage()">Book Now!</button>
              </div>
          </div>
        </div>
    </div>
</div>
`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  public startDate: Date = new Date(Date.now());
  housingService = inject(HouseService);
  route: ActivatedRoute = inject(ActivatedRoute);
  HostService: HostService = inject(HostService);
  housingLocationId = -1;
  currentIndex = 0;
  housingLocation: House | undefined;
  Images: Images[] = [];
  Host: Host | undefined;
  VisitorOptions = [1,2,3,4,5]
  BookDates = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  Visitors = new FormGroup({
    Count: new FormControl(0)
  });
  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.Host = this.HostService.GetHostData();
    this.housingService.getHousingLocationById(housingLocationId)
      .subscribe(housingLocation => {
        this.housingLocation = housingLocation;
        this.housingService.getHousingImagebyId(housingLocationId).subscribe(images => {
          this.Images = images;
    })
  });

  }
  get currentImage(): string{
    const currentImage = this.Images[this.currentIndex]?.URL ?? '';
    return currentImage;
  }

  previousImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.Images.length) % this.Images.length;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.Images.length;
  }
  RedirectToBookPage(){

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
}
