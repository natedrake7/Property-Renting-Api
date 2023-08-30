import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostService } from 'src/app/services/host.service';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { Host } from 'src/app/interfaces/host';
import {RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { error } from 'src/app/interfaces/error';
import { House } from 'src/app/interfaces/house';
import { HouseService } from 'src/app/services/house.service';
import { PreviewHouseComponent } from '../../Property/preview-house/preview-house.component';
import { EditHouseComponent } from '../../Property/edit-house/edit-house.component';
import { AuthModel } from 'src/app/interfaces/auth-model';
import { Images } from 'src/app/interfaces/images';
import * as FormData from 'form-data';

@Component({
  selector: 'app-host-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,PreviewHouseComponent,EditHouseComponent],
  template: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Listing</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./host-profile.component.css">
</head>

<body>
  <div class="container layout">
    <div class="row">
      <div class="col-md-1 buttons">
          <a routerLink="../">
            <button class="btn btn-primary profile-button" type="button">Profile</button>
          </a>
          <a routerLink="../Email">
            <button class="btn btn-primary email-button" type="button">Email</button>
          </a>
          <a routerLink="../Password">
            <button class="btn btn-primary password-button" type="button">Change Password</button>
          </a>
          <a routerLink="../PersonalData">
            <button class="btn btn-primary personal-data-button" type="button">Personal Data</button>
          </a>
      </div>
      <div class="col-md-3 profile-col">
        <section class="Host-Profile">
          <h2 class="section-heading">Your Profile</h2>
          <form [formGroup]="EditForm" (submit)="EditProfile()">
            <div class="form-group">
              <label for="host-name">Your name as a host</label>
              <input id="host-name" class="form-control" type="text" [placeholder]="Host?.HostName" formControlName="HostName">
              <div class="error" *ngIf="HostName_Error">
                <div *ngFor="let message of HostName_Error.Errors">
                  <p>{{message}}</p>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="host-about">About you</label>
                <div *ngIf="Host?.HostAbout != undefined">
                <textarea
                    id="host-about"
                    class="form-control"
                    rows="4"
                    formControlName="HostAbout"
                    [placeholder]="Host?.HostAbout"
              ></textarea>
                </div>
                <div *ngIf="Host?.HostAbout === undefined">
                <textarea
                    id="host-about"
                    class="form-control"
                    rows="4"
                    formControlName="HostAbout"
                    placeholder="Please give us a description about you..."
              ></textarea>
                </div> 
              <div class="error" *ngIf="HostAbout_Error">
                <div *ngFor="let message of HostAbout_Error.Errors">
                  <p>{{message}}</p>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="host-location">Your Location</label>
              <div *ngIf="Host?.HostLocation != undefined">
                  <input id="host-location" class="form-control" type="text" [placeholder]="Host?.HostLocation" formControlName="HostLocation">
                </div>
                <div *ngIf="Host?.HostLocation === undefined">
                  <input id="host-location" class="form-control" type="text" placeholder="Please enter you location" formControlName="HostLocation">
                </div> 
              <div class="error" *ngIf="HostLocation_Error">
                <div *ngFor="let message of HostLocation_Error.Errors">
                  <p>{{message}}</p>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="host-languages">Your Languages</label>
              <div *ngIf="Host?.Languages != undefined">
                <input id="host-languages" type="text" class="form-control" [placeholder]="Host?.Languages" formControlName="Languages">
              </div>
              <div *ngIf="Host?.Languages === undefined">
                <input id="host-languages" type="text" class="form-control" placeholder="Enter your proficient languages" formControlName="Languages">
              </div>
              <div class ="error"*ngIf="HostAbout_Error">
                <div *ngFor="let message of HostAbout_Error.Errors">
                  <p>{{message}}</p>
                </div>
              </div>
          </div>
          <div class="form-group">
              <label for="host-profession">Your Profession</label>
              <div *ngIf="Host?.Profession != undefined">
                <input id="host-profession" type="text" class="form-control" [placeholder]="Host?.Profession" formControlName="Profession">
              </div>
              <div *ngIf="Host?.Profession === undefined">
                <input id="host-profession" type="text" class="form-control" placeholder="Enter your current profession" formControlName="Profession">
              </div>
                <div class ="error"*ngIf="HostAbout_Error">
                  <div *ngFor="let message of HostAbout_Error.Errors">
                    <p>{{message}}</p>
                  </div>
              </div>
          </div>
          <div class="form-group">
              <label for="host-verification">Your Verification</label>
              <input id="host-verification" type="checkbox" formControlName="HostIdentityVerified">
          </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </section>
      </div>
      <div class="col-md-6">
        <div class="pic-container">
          <h4>Change Profile Picture</h4>
          <div class="profile-container">
                <img class="profile-pic"*ngIf="ProfilePic" [src]=" ProfilePic.URL" alt="No Profile Picture Available">
          </div>
          <div class="form-group">
              <input id="image-upload" type="file" (change)="OnImageUpload($event)" accept="image/*" multiple>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container houses-container">
    <div class="row">
      <div class="col-md-12">
        <div class="houses">
          <app-preview-house *ngFor="let housingLocation of Houses" [house]="housingLocation"></app-preview-house>
        </div>
      </div>
      <div class="col-md-12">
        <div class="add-house">
            <a [routerLink]="['AddHouse']">
              <button class="btn btn-primary house-button" type="button">List New Property</button>
            </a>
        </div>
      </div>
    </div>
  </div>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>

  `,
  styleUrls: ['./host-profile.component.css'] 
})
export class HostProfileComponent {
  HostService = inject(HostService);
  UserService = inject(UserService);
  HouseService = inject(HouseService);
  HostName_Error: error | undefined;
  HostAbout_Error: error | undefined;
  HostLocation_Error: error | undefined;
  imageError: string | undefined;
  ProfilePic: Images | undefined;
  ImageUpload: File | undefined;
  Host: Host | undefined;
  User: User | undefined;
  Houses: House[] | undefined;

  EditForm = new FormGroup({
    HostName: new FormControl('', Validators.required),
    HostAbout: new FormControl('',Validators.required),
    HostLocation: new FormControl('',Validators.required),
    Languages: new FormControl(''),
    Profession: new FormControl(''),
    HostIdentityVerified: new FormControl(false),
  })
  constructor(){
    this.Host = this.HostService.GetHostData();
    this.User = this.UserService.GetUserData();
    this.HostService.RetrieveHostImage().subscribe((image) =>{
      this.ProfilePic = image;
      this.HouseService.GetHousesByHostId(this.Host?.Id).subscribe((response) =>{
        this.Houses = response;
      }); 
    });
  }
  EditProfile(){
    const Data = this.GetData();
    this.HostService.EditHost(Data).subscribe((response) =>{
      console.log(response);
                      if('Token' in response){
                        const token = response as AuthModel;
                        localStorage.setItem('hosttoken',token.Token);
                        location.reload();
                      }
                      else{
                        const Host_Error = response as error[];
                        this.HostName_Error = Host_Error.find(item => item.Variable === 'HostName');
                        this.HostAbout_Error = Host_Error.find(item => item.Variable === 'HostAbout');
                        this.HostLocation_Error = Host_Error.find(item => item.Variable === 'HostLocation');
                      }
    });
  }
  GetData(){
    const Data = new FormData();
    const formValue = this.EditForm.value;
    Data.append('HostName',formValue.HostName || '');
    Data.append('HostAbout',formValue.HostAbout || '');
    Data.append('HostLocation',formValue.HostLocation || '');
    Data.append('Languages',formValue.Languages || '');
    Data.append('Profession',formValue.Profession || '');
    Data.append('HostIdentityVerified',formValue.HostIdentityVerified || '');
    Data.append('ProfilePic',this.ImageUpload);

    return Data;
  }
  OnImageUpload(event:any){
    const file = event.target.files[0];
    if (file) {
      this.ImageUpload = file; 
    } else {
      this.imageError = 'No image selected.';
    }
  } 
}
