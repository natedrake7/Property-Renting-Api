import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HostService } from 'src/app/services/host.service';
import { Images } from 'src/app/interfaces/images';
import { Host } from 'src/app/interfaces/host';

@Component({
  selector: 'app-preview-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container center-container">
      <div class="row custom-row-width">
          <div class="col-md-4">
            <div class="general">
              <div class="row">
                <div class="col-md-6">
                  <span class="host-pic">
                    <img class="profile-pic" [src]="ProfilePic!.URL">
                  </span>
                  <h5>{{Host?.HostName}} 
                    <span class="host-center"> Host
                    </span>
                  </h5>
                </div>
                <div class="col-md-6">
                  <div class="misc">
                    <h5 class="etc"> Reviews!</h5>
                    <hr style="border: 1px solid gray;border-radius: 12px;">
                    <h5 class="etc">Rating!</h5>
                    <hr style="border: 1px solid gray;border-radius: 12px;">
                    <h5 class="etc">Time!</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
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
    </div>
  </div>
  `,
  styleUrls: ['./preview-host.component.css']
})
export class PreviewHostComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  HostService: HostService = inject(HostService);
  ProfilePic: Images | undefined;
  Host: Host | undefined;
  constructor(){
    const Id = parseInt(this.route.snapshot.params['id'], 10);
    this.HostService.RetrivePublicHostDatabyId(Id).subscribe((host) =>{
      this.Host = host;
      this.HostService.RetrieveHostImageById(Id).subscribe((image) => {
        this.ProfilePic = image;
      })
    })
  }
}
