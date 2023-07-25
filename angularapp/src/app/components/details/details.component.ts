import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HouseService } from 'src/app/services/house.service';
import { House} from 'src/app/interfaces/house';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Images } from 'src/app/interfaces/images';
import { HostService } from 'src/app/services/host.service';
import { Host } from 'src/app/interfaces/host';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
        </section>
      </div>
    </div>
</div>
`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  housingService = inject(HouseService);
  route: ActivatedRoute = inject(ActivatedRoute);
  HostService: HostService = inject(HostService);
  housingLocationId = -1;
  currentIndex = 0;
  housingLocation: House | undefined;
  Images: Images[] = [];
  Host: Host | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  })

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
}
