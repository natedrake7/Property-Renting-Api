import { Component,inject } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HostService } from 'src/app/services/host.service';
import { Images } from 'src/app/interfaces/images';
import { Host } from 'src/app/interfaces/host';
import { House } from 'src/app/interfaces/house';
import { HouseService } from 'src/app/services/house.service';
import { PreviewHostHouseComponent } from '../preview-host-house/preview-host-house.component';

@Component({
  selector: 'app-preview-host',
  standalone: true,
  imports: [CommonModule,PreviewHostHouseComponent],
  providers: [DatePipe],
  template: `
    <div class="container center-container">
      <div class="row custom-row-width">
          <div class="col-md-4 host-general">
            <div class="general">
              <div class="row">
                <div class="col-md-6">
                  <span class="host-pic">
                    <img class="profile-pic" [src]="ProfilePic?.URL">
                  </span>
                  <h5>{{Host?.HostName}} 
                    <span class="host-center"> Host
                    </span>
                  </h5>
                </div>
                <div class="col-md-6">
                  <div class="misc">
                    <h5 class="etc">{{GetRatingsCount()}} Total Reviews</h5>
                    <hr style="border: 1px solid gray;border-radius: 12px;">
                    <h5 class="etc">{{GetHostRating()}}<i class="fas fa-star"></i></h5>
                    <hr style="border: 1px solid gray;border-radius: 12px;">
                    <h5 class="etc"><p>Host Since: {{ Host?.HostSince | date: 'dd/MM/yyyy' }}</p></h5>
                  </div>
                </div>
              </div>
            </div>
            <div class="certs">
              <div class="col-md-6">
                <h5>Certifications:</h5>
                <p class="certifications">Host is certified!</p>
              </div>
            </div>
          </div>
          <div class="col-md-8 host-info-col">
            <h2>General information for :
              <span class="host-name">
                {{Host?.HostName!}}          
              </span>
            </h2>
            <div class="row">
              <div class="col-md-4">
                <div class="listing-block">
                  <p class="host-info">
                    <span class="image">
                      <img class="image" src="../../../../assets/globe.png" alt="logo" aria-hidden="true">
                    </span>
                    <span class="bedrooms">
                      {{Host?.Languages}}
                    </span>
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="listing-block">
                  <p class="host-info">
                    <span class="image">
                      <img class="image" src="../../../../assets/profession.png" alt="logo" aria-hidden="true">
                    </span>
                    <span class="bedrooms">
                      {{Host?.Profession}}
                    </span>
                  </p>
                </div>
                </div>
            </div>
            <hr style="border: 1px solid gray;border-radius: 12px;">
            <h5>About</h5>
            <p>{{Host?.HostAbout}}</p>
            <hr style="border: 1px solid gray;border-radius: 12px;">
            <h5>Location</h5>
            <p>{{Host?.HostLocation}} <span class="host-location"> 
              <a href="https://www.google.com/maps/search/?api=1&query={{Host?.HostLocation}}" target="_blank">
                <img class="maps-link"src="../../../../assets/google_maps.png" alt="Link to Address" />
            </a>
            </span></p>
          </div>
          <div class="col-md-12">
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <h5>Some of host's properties:</h5>
          <div class="row">
            <app-preview-host-house class="properties" *ngFor="let house of Houses" [house]="house"></app-preview-host-house>
          </div>
          <hr style="border: 1px solid gray;border-radius: 12px;">
          <h5>Reviews of the host's properties:</h5>
          <div class="reviews-container" *ngFor="let house of Houses">
            <div *ngFor="let review of house.Reviews;let firstReview = first">
              <div *ngIf="firstReview">
              <div class="reviews">
                <div class="review-contents">
                  <h5 class="reviewer-name">{{review.ReviewerName}},</h5>
                  <p class="review-comments">{{review.Comments}}</p>
                    <div class="score">Property: <span class="review-rating">{{review.ReviewScoresRating}}<i class="fas fa-star"></i></span></div>
                    <div class="score"> Location: <span class="review-rating">{{review.ReviewScoresLocation}}<i class="fas fa-star"></i></span></div>
                    <div class="score"> Host communication: <span class="review-rating">{{review.ReviewScoresCommunication}}<i class="fas fa-star"></i></span></div>
                    <div class="score">Cleaninless: <span class="review-rating">{{review.ReviewScoresCleanliness}}<i class="fas fa-star"></i></span></div>        
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  `,
  styleUrls: ['./preview-host.component.css']
})
export class PreviewHostComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  HostService: HostService = inject(HostService);
  HouseService: HouseService = inject(HouseService);
  DatePipe: DatePipe = inject(DatePipe);
  ProfilePic: Images | undefined;
  Host: Host | undefined;
  Id: number | undefined;
  Houses: House[] = [];
  constructor(){
    this.Id = parseInt(this.route.snapshot.params['id'], 10);
    this.HostService.RetrivePublicHostDatabyId(this.Id).subscribe((host) =>{
      this.Host = host;
      this.HouseService.GetHousesByHostId(this.Id).subscribe((houses) => {
          this.Houses = houses;
      });
    });
  }

  ngOnInit(){
    this.HostService.RetrieveHostImageById(this.Id!).subscribe((image) => {
      this.ProfilePic = image;
    });
  }
  GetHostRating():number{
    var Rating = 0;
    for(let i = 0;i < this.Houses.length;i++)
    {
      Rating += this.Houses[i].ReviewScoresRating;
    }
    return Rating /= this.Houses.length;
  }
  GetRatingsCount():number{
    var Count = 0;
    for(let i = 0;i < this.Houses.length;i++)
    {
      Count += this.Houses[i].Reviews.length;
    }
    return Count;
  }
}
