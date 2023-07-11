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
  <article class="listing-containter">
    <section class="listing-description">
          <h2 class="listing-heading">{{housingLocation?.Name}}</h2>
          <p class="listing-location">{{housingLocation?.City}}, {{housingLocation?.State}}</p>
    </section>
    <section class="listing-images">
      <img *ngFor="let image of housingImages" class="listing-image" 
      [src]="image.URL" alt="{{ image.Name }}">
    </section>
    <section class="listing-features">
      <h2 class="section-heading">About this housing location</h2>
      <p class="listing-description">{{housingLocation?.Description}}</p>
    </section>
    <section class="listing-apply">
      <h2 class="section-heading">Apply now to live here</h2>
      <form [formGroup]="applyForm" (submit)="this.housingService.submitApplication">
        <label for="first-name">First Name</label>
        <input id="first-name" type="text" formControlName="firstName">

        <label for="last-name">Last Name</label>
        <input id="last-name" type="text" formControlName="lastName">

        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email">
        <button type="submit" class="primary">Apply now</button>
      </form>
    </section>
  </article>
`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  housingService = inject(HouseService);
  route: ActivatedRoute = inject(ActivatedRoute);
  housingLocationId = -1;
  housingLocation: House | undefined;
  housingImages: Images[] = [];
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  })

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId)
      .then(housingLocation => {
        this.housingLocation = housingLocation;
      });
    this.housingService.getHousingImagebyId(housingLocationId).then(images => {
      this.housingImages = images;
    })
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    )
  }
}
