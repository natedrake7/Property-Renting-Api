import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { House } from 'src/app/interfaces/house';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <section class="listing">
    <div class="row">
      <a [routerLink]="['/details/', house.Id]">
        <div class="thumbnail-container">
          <img class="thumbnail"*ngIf="house.ThumbnailURL" [src]=" house.ThumbnailURL" alt="No Thumbnail Available">
        </div>
      </a>
      <div class="details">
        <p class="listing-location">{{ house.City}}, {{ house.Country }}
          <span class="ratings"> 
            {{house.ReviewScoresRating}}
            <i class="fas fa-star"></i> 
        </span>
        </p>
        <p class="listing-location">{{house.Street}},{{house.Neighbourhood}}
              <a href="https://www.google.com/maps/search/?api=1&query={{house.Street}},{{house.Neighbourhood}},{{house.City}}" target="_blank">
                <img class="maps-link"src="../../../../assets/google_maps.png" alt="Link to Address" />
            </a>
        </p>
        <p class="pricing">{{house.Price}}€/Night</p>
      </div>
      <div class="text-right">
        <a class="property-link" [routerLink]="['/details/', house.Id]">Book Now</a>
      </div>
    </div>
    </section>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    `,
  styleUrls: ['./house.component.css']
})
export class HouseComponent {
  @Input() house!: House;
}
