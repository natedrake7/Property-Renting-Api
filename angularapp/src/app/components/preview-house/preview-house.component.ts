import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { House } from 'src/app/interfaces/house';

@Component({
  selector: 'app-preview-house',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
  <section class="listing">
    <h2 class="listing-heading">{{ house.Name }}</h2>
    <a [routerLink]="['/details/', house.Id]">
      <img class="thumbnail"*ngIf="house.ThumbnailURL" [src]=" house.ThumbnailURL" alt="No Thumbnail Available">
    </a>
    <p class="listing-location">{{ house.City}}, {{ house.State }}</p>
    <a class="property-link" [routerLink]="['/details/', house.Id]">Preview Property Page</a>
    <a class="property-link" [routerLink]="['EditHouse', house.Id]">Edit Property Page</a>
    </section>
  `,
  styleUrls: ['./preview-house.component.css']
})
export class PreviewHouseComponent {
  @Input() house!: House;
}
