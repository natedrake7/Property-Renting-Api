import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HouseService } from 'src/app/services/house.service';
import { House} from 'src/app/interfaces/house';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Images } from 'src/app/interfaces/images';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="container layout">
    <div class="row">
      <div class="listing-description">
            <h5 class="listing-heading">{{housingLocation?.Name}}</h5>
            <p class="listing-location">{{housingLocation?.City}}, {{housingLocation?.State}}</p>
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
          <h2 class="section-heading">About this housing location</h2>
          <p class="listing-description">{{housingLocation?.Description}}</p>
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
  housingLocationId = -1;
  currentIndex = 0;
  housingLocation: House | undefined;
  Images: Images[] = [];
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  })

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId)
      .subscribe(housingLocation => {
        this.housingLocation = housingLocation;
        this.housingService.getHousingImagebyId(housingLocationId).subscribe(images => {
          this.Images = images;
    })
  });

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
}
