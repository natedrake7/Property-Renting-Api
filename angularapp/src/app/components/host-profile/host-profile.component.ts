import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostService } from 'src/app/services/host.service';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { Host } from 'src/app/interfaces/host';
import {RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-host-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
    <div class="left-buttons">
      <a routerLink="../">
        <button class="profile-button" type="button">Profile</button>
      </a>
      <a routerLink="../Email">
          <button class="email-button" type="button">Email</button>
        </a>
        <a routerLink="../Password">
          <button class="password-button" type="button">Change Password</button>
        </a>
        <a routerLink="../PersonalData">
          <button class="personal-data-button" type="button">Personal Data</button>
        </a>
    </div>
    <section class="Host-Profile">
    <h2 class="section-heading">Your Profile</h2>
      <form [formGroup]="EditForm" (submit)="EditProfile()">
      <label for="host-name">Your name as a host</label>
      <input id="host-name" type="text" [placeholder]="Host?.HostName" formControlName="HostName">
      <div class ="error"*ngIf="HostName_Error">
          <div *ngFor="let message of HostName_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
      <label for="host-about">About you</label>
      <input id="host-about" type="text" [placeholder]="Host?.HostAbout" formControlName="HostAbout">
      <div class ="error"*ngIf="HostAbout_Error">
          <div *ngFor="let message of HostAbout_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
      <label for="host-location">Your Location</label>
      <input id="host-location" type="text" [placeholder]="Host?.HostLocation" formControlName="HostLocation">
      <div class ="error"*ngIf="HostLocation_Error">
          <div *ngFor="let message of HostLocation_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <button type="submit" class="primary">Submit</button>
      </form>
    </section>
    <div class="left-buttons">
      <a [routerLink]="['AddHouse']">
        <button class="house-button" type="button">Add a House</button>
      </a>
  `,
  styleUrls: ['./host-profile.component.css']
})
export class HostProfileComponent {
  HostService = inject(HostService);
  UserService = inject(UserService);
  HostName_Error: error | undefined;
  HostAbout_Error: error | undefined;
  HostLocation_Error: error | undefined;
  Host: Host | undefined;
  User: User | undefined;

  EditForm = new FormGroup({
    HostName: new FormControl('', Validators.required),
    HostAbout: new FormControl('',Validators.required),
    HostLocation: new FormControl('',Validators.required),
  })
  constructor(){
    this.Host = this.HostService.GetHostData();
    this.User = this.UserService.GetUserData();
  }
  EditProfile(){
    const formValue = this.EditForm.value;
    const Hostname = formValue.HostName || '';
    const HostAbout = formValue.HostAbout || '';
    const HostLocation = formValue.HostLocation || '';
    this.HostService.EditHost(Hostname,HostAbout,HostLocation,this.User?.Id).subscribe((response) =>{
                      console.log(response);
                      if('HostName' in response){
                        const HostData = response as Host;
                        this.HostService.SetHostData(HostData);
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
