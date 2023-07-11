import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostService } from 'src/app/services/host.service';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { Host } from 'src/app/interfaces/host';
import {RouterModule } from '@angular/router';

@Component({
  selector: 'app-host-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
    <div class="left-buttons">
      <a routerLink="../">
        <button class="profile-button" type="button">Profile</button>
      </a>
        <a [routerLink]="['Password']">
          <button class="password-button" type="button">Change Password</button>
        </a>
        <a [routerLink]="['PersonalData']">
          <button class="personal-data-button" type="button">Personal Data</button>
        </a>
    </div>
    <section class="Host-Profile">
    <h2 class="section-heading">Your Profile</h2>
      <form [formGroup]="EditForm" (submit)="EditProfile()">
      <label for="host-name">Your name as a host</label>
      <input id="host-name" type="text" [placeholder]="Host?.HostName" formControlName="HostName">
      <label for="host-about">About you</label>
      <input id="username" type="text" [placeholder]="Host?.HostAbout" formControlName="HostAbout">
      <label for="host-location">Your Location</label>
      <input id="host-location" type="text" [placeholder]="Host?.HostLocation" formControlName="HostLocation">
        <button type="submit" class="primary">Submit</button>
      </form>
    </section>
  `,
  styleUrls: ['./host-profile.component.css']
})
export class HostProfileComponent {
  HostService = inject(HostService);
  Host: Host | undefined;

  EditForm = new FormGroup({
    HostName: new FormControl('', Validators.required),
    HostAbout: new FormControl('',Validators.required),
    HostLocation: new FormControl('',Validators.required),
  })
  constructor(){
    this.Host = this.HostService.GetHostData();
  }
  EditProfile(){

  }
  
}
