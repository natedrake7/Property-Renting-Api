import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseComponent } from '../house/house.component';
import { House} from 'src/app/interfaces/house';
import { HouseService } from 'src/app/services/house.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HouseComponent, RouterModule],
  template: `
<section class="homes">
  <div class="container">
    <div class="row">
      <div class="col">
        <app-housing-location *ngFor="let housingLocation of filteredLocationList" [house]="housingLocation"></app-housing-location>
      </div>
    </div>
  </div>
</section>

        `
  ,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  housingLocationList: House[] = [];
  filteredLocationList: House[] = [];
  housingService: HouseService = inject(HouseService);
  RoutingService: Router = inject(Router);
  constructor() {
    this.housingService.getAllHousingLocations().subscribe(data => {
      this.filteredLocationList = data;
      this.housingLocationList = data;
      this.filteredLocationList.forEach((house) => {
        this.housingService.getThumbnailImageById(house.Id).subscribe(image => {
          if (image) {
            house.ThumbnailURL = image.URL;
            house.Image = image.Image;
          }
          else
            house.ThumbnailURL = "empty";
        })
      });
    });
  }
  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
    }
    text = text.toLowerCase();
    this.filteredLocationList = this.housingLocationList.filter(
      housingLocation => housingLocation?.City.toLowerCase().includes(text)
    );
  }

}
