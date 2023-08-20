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
    <div class="details">
      {{house.ReviewScoresRating}}<i class="fas fa-star"></i>,{{house.Name}}
    </div>
      <a [routerLink]="['/details/', house.Id]">
        <div class="thumbnail-container">
          <img class="thumbnail"*ngIf="house.ThumbnailURL" [src]=" house.ThumbnailURL" alt="No Thumbnail Available">
        </div>
      </a>
    </div>
    </section>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    `,
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
