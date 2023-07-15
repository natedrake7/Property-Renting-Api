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
  <section class="listing">
    <h2 class="listing-heading">{{ house.Name }}</h2>
    <a [routerLink]="['/details/', house.Id]">
      <img class="thumbnail"*ngIf="house.ThumbnailURL" [src]=" house.ThumbnailURL" alt="No Thumbnail Available">
    </a>
    <p class="listing-location">{{ house.City}}, {{ house.State }}</p>
    <a class="property-link" [routerLink]="['/details/', house.Id]">Preview Property Page</a>
    <a class="property-link" [routerLink]="['EditHouse', house.Id]">Edit Property Page</a>
    <button class="property-link" type="button" (click)="RemoveProperty()">Remove Property</button>
    <div class="deletecheck" *ngIf="DeleteConfirmation">
      <p class="message red">Are you sure you want to delete this property?</p>
      <p class="message red">This action cannot be revoked!</p>
      <button class="delete-button" type="button" (click)="RemovePropertyConfirmed()">Yes</button>
      <button class="delete-button" type="button" (click)="RemoveProperty()">No</button>
    </div>
    </section>
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
