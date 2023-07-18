import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseComponent } from '../house/house.component';
import { House} from 'src/app/interfaces/house';
import { HouseService } from 'src/app/services/house.service';
import { Images } from 'src/app/interfaces/images';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HouseComponent, RouterModule],
  template: `
<section class="main">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <div class="search-wrapper">
          <form class="search d-flex">
            <div class="form-group flex-grow-1">
              <input type="text" class="form-control" placeholder="Filter by city" #filter>
            </div>
            <button class="btn btn-primary searchbutton" type="button" (click)="filterResults(filter.value)">Search</button>
          </form>
        </div>
      </div>
      <div class="col-md-6">
        <div class="d-flex justify-content-end">
          <form class="user">
            <div *ngIf="!UserStatus">
              <a [routerLink]="['Register']">
                <button class="btn btn-primary register" type="button">Register</button>
              </a>
              <a [routerLink]="['Login']">
                <button class="btn btn-primary login" type="button">Login</button>
              </a>
            </div>
            <div *ngIf="UserStatus">
              <a [routerLink]="['Profile']">
                <button class="btn btn-primary user-profile" type="button">Hello {{ this.Username }}</button>
              </a>
              <button class="btn btn-primary logout" type="button" (click)="Logout()">Logout</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
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
  userService: UserService = inject(UserService);
  UserStatus: boolean = false;
  Username: string | undefined;
  Logout_Error: error | undefined;
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
    this.UserStatus = this.userService.GetUserStatus();
    this.Username = this.userService.GetUsername();
  }
  Logout() {
    if (this.userService.GetUserStatus() == true)
      this.userService.Logout().subscribe(() => { localStorage.removeItem('User'); location.reload(); });
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
