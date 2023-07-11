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
    <h2 class="listing-heading">{{ house.Name }}</h2>
    <a [routerLink]="['/details/', house.Id]">
      <img class="thumbnail"*ngIf="house.ThumbnailURL" [src]=" house.ThumbnailURL" alt="No Thumbnail Available">
    </a>
    <p class="listing-location">{{ house.City}}, {{ house.State }}</p>
    </section>`,
  styleUrls: ['./house.component.css']
})
export class HouseComponent {
  @Input() house!: House;
}
