import { Component,Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { House } from 'src/app/interfaces/house';
import { HouseService } from 'src/app/services/house.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-preview-house',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Listing</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./preview-house.component.css">
</head>

<body>
  <section class="listing">
    <div class="row">
      <div class="col-md-6">
        <h2 class="listing-heading">{{ house.Name }}</h2>
        <a class="image-link" [routerLink]="['/details/', house.Id]">
          <img class="thumbnail"*ngIf="house.ThumbnailURL" [src]=" house.ThumbnailURL" alt="No Thumbnail Available">
        </a>
        <p class="listing-location">{{ house.City}}, {{ house.State }}</p>
        <p class="listing-location">{{house.Country}} , {{house.CountryCode}}</p>
        <p class="listing-location">{{house.Street}},{{house.Neighbourhood}},{{house.Zipcode}},
          <a href="https://www.google.com/maps/search/?api=1&query={{house.Street}},{{house.Neighbourhood}},{{house.City}}" target="_blank">
            <img class="maps-link"src="../../../../assets/google_maps.png" alt="Link to Address" />
        </a>
        </p>
        <a class="property-link" [routerLink]="['/details/', house.Id]">Preview Property Page</a>
        <a class="property-link" [routerLink]="['EditHouse', house.Id]">Edit Property Page</a>       
        <button class="btn btn-primary property-link" type="button" (click)="RemoveProperty()">Remove Property</button>
        <div class="deletecheck" *ngIf="DeleteConfirmation">
          <p class="message red">Are you sure you want to delete this property?</p>
          <p class="message red">This action cannot be revoked!</p>
          <button class="btn btn-primary delete-button" type="button" (click)="RemovePropertyConfirmed()">Yes</button>
          <button class="btn btn-primary delete-button" type="button" (click)="RemoveProperty()">No</button>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <h2 class="header text-center">General Information</h2>
          <div class="col-md-4">
            <h5>Property Type </h5>
            <p>{{house.PropertyType}}</p>
            <h5>Property Size </h5>
            <p>{{house.SquareFeet}}</p>
          </div>
          <div class="col-md-4">
            <h5>House Summary </h5>
            <p>{{house.Summary}}</p>
            <h5>House Space </h5>
            <p>{{house.Space}}</p>
          </div>
          <div class="col-md-4">
            <h5>Overall Rating </h5>
            <p>{{house.ReviewScoresRating}}<i class="fas fa-star"></i></p>
            <h5>Location Rating </h5>
            <p>{{house.ReviewScoresLocation}}<i class="fas fa-star"></i></p>
            <h5>Cleanliness Rating </h5>
            <p>{{house.ReviewScoresCleanliness}}<i class="fas fa-star"></i></p>
            <h5>Communication Rating </h5>
            <p>{{house.ReviewScoresCommunication}}<i class="fas fa-star"></i></p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</html>
  `,
  styleUrls: ['./preview-house.component.css']
})
export class PreviewHouseComponent {
  @Input() house!: House;
  User: User | undefined;
  HouseService = inject(HouseService);
  UserService = inject(UserService);
  DeleteConfirmation:boolean = false;
  constructor(){
    this.User = this.UserService.GetUserData();
  }

  ngOnInit() {
    this.HouseService.getThumbnailImageById(this.house.Id).subscribe((image) =>{
      if(image != undefined){
        this.house.ThumbnailURL = image.URL;
        this.house.Image = image.Image;
      }
      else
        this.house.ThumbnailURL = "empty";
    });
  }
  RemoveProperty(){
    this.DeleteConfirmation = !this.DeleteConfirmation;
  }
  RemovePropertyConfirmed(){
    console.log(this.User?.Id);
    this.HouseService.DeleteHousebyId(this.house.Id,this.User?.Id).subscribe((response) =>{
      console.log(response);
      location.reload();
    })
  }
}
