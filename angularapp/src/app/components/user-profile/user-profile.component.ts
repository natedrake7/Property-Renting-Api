import { Component,Host,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { error } from 'src/app/interfaces/error';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
    <div class="left-buttons">
        <div *ngIf="User?.IsHost === true">
         <a [routerLink]="['Host']">
          <button class="host-profile-button" type="button">Host Profile</button>
        </a>
        </div>
        <a [routerLink]="['Email']">
          <button class="email-button" type="button">Email</button>
        </a>
        <a [routerLink]="['Password']">
          <button class="password-button" type="button">Password</button>
        </a>
        <a [routerLink]="['PersonalData']">
          <button class="personal-data-button" type="button">Personal Data</button>
        </a>
    </div>
    <section class="Profile">
      <h2 class="section-heading">Your Profile</h2>
      <form [formGroup]="EditForm" (submit)="EditProfile()">
      <label for="username">Username</label>
        <input id="username" type="text" [placeholder]="User?.UserName" formControlName="UserName">
        <div class ="error"*ngIf="Username_Error">
          <div *ngFor="let message of Username_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="first-name">First Name</label>
        <input id="first-name" type="text" [placeholder]="User?.FirstName" formControlName="FirstName">
        <div class ="error"*ngIf="Firstname_Error">
          <div *ngFor="let message of Firstname_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="last-name">Last Name</label>
        <input id="last-name" type="text" [placeholder]="User?.LastName" formControlName="LastName">
        <div class ="error"*ngIf="Lastname_Error">
          <div *ngFor="let message of Lastname_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="phone">Phone Number</label>
        <input id="phone" type="text" [placeholder]="User?.PhoneNumber" formControlName="PhoneNumber">
        <div class ="error"*ngIf="Phone_Error">
          <div *ngFor="let message of Phone_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="description">Description</label>
        <div *ngIf="User?.Bio != null">
          <input id="description" type="text" [placeholder]="User?.Bio" formControlName="Bio">
        </div>
        <div *ngIf="User?.Bio == null">
          <input id="description-null" type="text" placeholder="Enter your Description" formControlName="Bio">
        </div>
        <button type="submit" class="primary">Change</button>
      </form>
    </section>
  `,
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  UserService = inject(UserService);
  RoutingService: Router = inject(Router);
  Username_Error: error|undefined;
  Firstname_Error: error|undefined;
  Lastname_Error: error|undefined;
  Phone_Error: error|undefined;
  Bio_Error : error|undefined;
  User: User | undefined;

  EditForm = new FormGroup({
    UserName: new FormControl('', Validators.required),
    FirstName: new FormControl('',Validators.required),
    LastName: new FormControl('',Validators.required),
    PhoneNumber: new FormControl('', Validators.required),
    Bio: new FormControl('', Validators.required),
  })
  constructor(){
    this.User = this.UserService.GetUserData();
  }
  EditProfile(){
    const formValue = this.EditForm.value;
    const username = formValue.UserName || ''; // Use empty string if null or undefined
    const firstName = formValue.FirstName || '';
    const lastName = formValue.LastName || '';
    const phonenumber = formValue.PhoneNumber || '';
    const bio = formValue.Bio || '';
    this.UserService.EditUser(username,firstName,lastName,phonenumber,bio)
                    .subscribe((response) => {
                    if('UserName' in response){
                      const UserResponse = response as User;
                      console.log(response);
                      this.UserService.SetUserData(UserResponse);
                      location.reload();
                    }else{
                      const ErrorResponse = response as error[];
                      this.Username_Error = ErrorResponse.find(item => item.Variable === 'Username');
                      this.Firstname_Error = ErrorResponse.find(item => item.Variable === 'FirstName');
                      this.Lastname_Error = ErrorResponse.find(item => item.Variable === 'LastName');
                      this.Phone_Error = ErrorResponse.find(item => item.Variable === 'PhoneNumber');
                      this.Bio_Error = ErrorResponse.find(item => item.Variable === 'Bio');
                    }
                    });
  }
}
