import { Component,Input,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { House } from 'src/app/interfaces/house';
import { HouseService } from 'src/app/services/house.service';

@Component({
  selector: 'app-preview-host-house',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
  <section class="listing">
    <div class="row">
      <a [routerLink]="['/details/', house.Id]">
        <div class="thumbnail-container">
          <img class="thumbnail"*ngIf="house.ThumbnailURL" [src]=" house.ThumbnailURL" alt="No Thumbnail Available">
        </div>
      </a>
      <div class="details">
        <p class="name">{{house.Name}}</p>
        <p class="rating">Rating!</p>
      </div>
    </div>
    </section>`,
  styleUrls: ['./preview-host-house.component.css']
})
export class PreviewHostHouseComponent {
  @Input() house!: House;
  HouseService:HouseService = inject(HouseService);

  ngOnInit(){
    this.HouseService.getThumbnailImageById(this.house.Id).subscribe(image => {
    if (image) {
      this.house.ThumbnailURL = image.URL;
      this.house.Image = image.Image;
    }
    else
     this.house.ThumbnailURL = "empty";
    });
}
}
