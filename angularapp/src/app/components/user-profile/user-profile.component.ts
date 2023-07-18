import { Component,Host,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { error } from 'src/app/interfaces/error';
import { User } from 'src/app/interfaces/user';
import { AuthModel } from 'src/app/interfaces/auth-model';
import { HostService } from 'src/app/services/host.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Profile</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./user-profile.component.css">
</head>

<body>
  <div class="container">
    <div class="row">
      <div class="col-md-1 nav-buttons">
          <div *ngIf="HostService.GetHostStatus()">
            <a [routerLink]="['Host']">
              <button class="btn btn-primary" type="button">Host Profile</button>
            </a>
          </div>
          <a [routerLink]="['Email']">
            <button class="btn btn-primary" type="button">Email</button>
          </a>
          <a [routerLink]="['Password']">
            <button class="btn btn-primary" type="button">Password</button>
          </a>
          <a [routerLink]="['PersonalData']">
            <button class="btn btn-primary" type="button">Personal Data</button>
          </a>
        </div>
      <div class="col-md-3 profile-col">
        <section class="Profile">
          <h2>Your Profile</h2>
          <form [formGroup]="EditForm" (submit)="EditProfile()">
            <div class="row">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input id="username" class="form-control" type="text" [placeholder]="User?.UserName"
                    formControlName="UserName">
                  <div class="error" *ngIf="Username_Error">
                    <div *ngFor="let message of Username_Error.Errors">
                      <p>{{message}}</p>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="first-name">First Name</label>
                  <input id="first-name" class="form-control" type="text" [placeholder]="User?.FirstName"
                    formControlName="FirstName">
                  <div class="error" *ngIf="Firstname_Error">
                    <div *ngFor="let message of Firstname_Error.Errors">
                      <p>{{message}}</p>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="last-name">Last Name</label>
                  <input id="last-name" class="form-control" type="text" [placeholder]="User?.LastName"
                    formControlName="LastName">
                  <div class="error" *ngIf="Lastname_Error">
                    <div *ngFor="let message of Lastname_Error.Errors">
                      <p>{{message}}</p>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="phone">Phone Number</label>
                  <input id="phone" class="form-control" type="text" [placeholder]="User?.PhoneNumber"
                    formControlName="PhoneNumber">
                  <div class="error" *ngIf="Phone_Error">
                    <div *ngFor="let message of Phone_Error.Errors">
                      <p>{{message}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group">
              <label for="description">Description</label>
              <div *ngIf="User?.Bio != null">
                <input id="description" class="form-control" type="text" [placeholder]="User?.Bio" formControlName="Bio">
              </div>
              <div *ngIf="User?.Bio == null">
                <input id="description-null" class="form-control" type="text" placeholder="Enter your Description"
                  formControlName="Bio">
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </section>
      </div>
    </div>
  </div>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>

  `,
})
export class UserProfileComponent {
  UserService = inject(UserService);
  RoutingService: Router = inject(Router);
  HostService: HostService = inject(HostService);
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
                    if('Token' in response){
                      const token = response as AuthModel;
                      localStorage.setItem('usertoken',token.Token);
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
