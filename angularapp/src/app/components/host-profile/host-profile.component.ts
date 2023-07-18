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
import { PreviewHouseComponent } from '../preview-house/preview-house.component';
import { EditHouseComponent } from '../edit-house/edit-house.component';
import { AuthModel } from 'src/app/interfaces/auth-model';

@Component({
  selector: 'app-host-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,PreviewHouseComponent,EditHouseComponent],
  template: `
<div class="container">
  <div class="row">
    <div class="col-md-5">
      <div class="left-buttons">
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
    </div>
    <div class="col-md-9">
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
                <input id="host-about" class="form-control" type="text" [placeholder]="Host?.HostAbout" formControlName="HostAbout">
              </div>
              <div *ngIf="Host?.HostAbout === undefined">
                <input id="host-about" class="form-control" type="text" placeholder="Please give us a description about you" formControlName="HostAbout">
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
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </section>
    </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <div class="left-buttons">
        <a [routerLink]="['AddHouse']">
          <button class="btn btn-primary house-button" type="button">Add a House</button>
        </a>
      </div>
      <div class="houses">
        <app-preview-house *ngFor="let housingLocation of Houses" [house]="housingLocation"></app-preview-house>
      </div>
    </div>
  </div>
</div>

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
  Host: Host | undefined;
  User: User | undefined;
  Houses: House[] | undefined;

  EditForm = new FormGroup({
    HostName: new FormControl('', Validators.required),
    HostAbout: new FormControl('',Validators.required),
    HostLocation: new FormControl('',Validators.required),
  })
  constructor(){
    this.Host = this.HostService.GetHostData();
    this.User = this.UserService.GetUserData();
    this.HouseService.GetHousesByHostId(this.Host?.Id).subscribe((response) =>{
      this.Houses = response;
    }); 
  }
  EditProfile(){
    const formValue = this.EditForm.value;
    const Hostname = formValue.HostName || '';
    const HostAbout = formValue.HostAbout || '';
    const HostLocation = formValue.HostLocation || '';
    this.HostService.EditHost(Hostname,HostAbout,HostLocation,this.User?.Id).subscribe((response) =>{
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
}
