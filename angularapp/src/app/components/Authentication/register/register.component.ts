import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { FormControl,FormGroup,ReactiveFormsModule,UntypedFormBuilder,Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { HostService } from 'src/app/services/host.service';
import { HttpClientModule,HttpClientXsrfModule } from '@angular/common/http';
import { error } from 'src/app/interfaces/error';
import * as FormData from 'form-data';
import { AuthModel } from 'src/app/interfaces/auth-model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule, HttpClientModule,HttpClientXsrfModule],
  template: `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Listing</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="./register.component.css">
  </head>
  <body>
    <div class="container registration">
      <h2 class="section-heading">Register</h2>
      <form [formGroup]="RegisterForm" (submit)="registerUser()">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" class="form-control" type="text" placeholder="Enter your Username" formControlName="UserName">
        </div>
        <div class ="error" *ngIf="Username_Error">
          <div *ngFor="let message of Username_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="error" *ngIf="!Username_Error && CredentialTaken_Error">
          <div *ngIf="CredentialTaken_Error.Errors[0].includes('Username')">
            <p>{{CredentialTaken_Error.Errors[0]}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="first-name">First Name</label>
          <input id="first-name" class="form-control" type="text" placeholder="Enter your First Name" formControlName="FirstName">
        </div>
        <div class ="error"*ngIf="Firstname_Error">
          <div *ngFor="let message of Firstname_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="last-name">Last Name</label>
          <input id="last-name" class="form-control" type="text" placeholder="Enter your Last Name" formControlName="LastName">
        </div>
        <div class ="error"*ngIf="Lastname_Error">
          <div *ngFor="let message of Lastname_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" class="form-control" type="email" placeholder="Enter your Email" formControlName="Email">
        </div>
        <div class ="error"*ngIf="Email_Error">
          <div *ngFor="let message of Email_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="error" *ngIf="!Email_Error && CredentialTaken_Error">
          <div *ngIf="CredentialTaken_Error.Errors.length === 1 && CredentialTaken_Error.Errors[0].includes('Email')">
            <p>{{CredentialTaken_Error.Errors[0]}}</p>
          </div>
          <div *ngIf="CredentialTaken_Error.Errors.length > 1">
            <p>{{CredentialTaken_Error.Errors[1]}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input id="phone" class="form-control" type="text" placeholder="Enter your Phone Number" formControlName="PhoneNumber">
        </div>
        <div class ="error"*ngIf="Phone_Error">
          <div *ngFor="let message of Phone_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <input id="description" class="form-control" type="text" placeholder="Enter your Description" formControlName="Description">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" class="form-control" type="password" placeholder="Enter your Password" formControlName="Password">
        </div>
        <div class ="error"*ngIf="Password_Error">
          <div *ngFor="let message of Password_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input id="confirm-password" class="form-control" type="password" placeholder="Confirm your Password" formControlName="ConfirmPassword">
        </div>
        <div class ="error"*ngIf="ConfPassword_Error">
          <div *ngFor="let message of ConfPassword_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="is-host">Host</label>
              <input id="is-host" type="checkbox" formControlName="IsHost">
            </div>
          </div>
        <div class ="host"*ngIf="RegisterForm.value.IsHost">
          <div class="form-group">
              <label for="host-name">Your Host Name</label>
              <input id="host-name" class="form-control" type="text" placeholder="Enter your Host name" formControlName="HostName">
          </div>
              <div class ="error"*ngIf="HostName_Error">
              <div *ngFor="let message of HostName_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="host-location">Your Location</label>
              <input id="host-location" class="form-control" type="text" placeholder="Enter your Location" formControlName="HostLocation">
            </div>
              <div class ="error"*ngIf="HostLocation_Error">
              <div *ngFor="let message of HostLocation_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="host-about">Your Host Description</label>
              <input id="host-about" class="form-control" type="text" placeholder="Enter your description" formControlName="HostAbout">
            </div>
            <div class ="error"*ngIf="HostAbout_Error">
              <div *ngFor="let message of HostAbout_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="host-languages">Your Languages</label>
              <input id="host-languages" class="form-control" type="text" placeholder="Enter your proficient languages" formControlName="Languages">
            </div>
            <div class ="error"*ngIf="HostAbout_Error">
              <div *ngFor="let message of HostAbout_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
          <div class="form-group">
              <label for="host-profession">Your Profession</label>
                <input id="host-profession" class="form-control" type="text" placeholder="Enter your current profession" formControlName="Profession">
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
          <div class ="error"*ngIf="HostAbout_Error">
            <div *ngFor="let message of HostAbout_Error.Errors">
              <p>{{message}}</p>
            </div>
          </div>
            <div class="form-group">
              <label for="thumbnail">Upload Profile Picture</label>
              <input id="thumbnail" class="form-control" type="file" (change)="OnImageUpload($event)" accept="image/*">
            </div>
            <div class="error" *ngIf="ProfilePic_Error">
              <div *ngFor="let message of ProfilePic_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
        </div>
          <div class="col-md-6">
            <button *ngIf="RegisterForm.value.IsHost" type="submit" class="btn btn-primary submit-host">Register</button>
            <button *ngIf="!RegisterForm.value.IsHost" type="submit" class="btn btn-primary submit">Register</button>
          </div>
        </div>
      </form>
    </div>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>

  `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  UserService = inject(UserService);
  HostService = inject(HostService);
  RoutingService: Router = inject(Router);
  ProfilePic: File | undefined;
  Username_Error: error|undefined;
  CredentialTaken_Error: error|undefined;
  Firstname_Error: error|undefined;
  Lastname_Error: error|undefined;
  Email_Error: error|undefined;
  Phone_Error: error|undefined;
  Password_Error: error|undefined;
  ConfPassword_Error: error|undefined;
  HostName_Error: error | undefined;
  HostLocation_Error : error | undefined;
  HostAbout_Error : error | undefined;
  ProfilePic_Error: error|undefined;
  Languages_Error: error | undefined;
  Profession_Error: error | undefined;
  imageError: string | undefined;

  HostRegistrationForm: boolean = false;

  RegisterForm = new FormGroup({
    UserName: new FormControl('', Validators.required),
    FirstName: new FormControl('',Validators.required),
    LastName: new FormControl('',Validators.required),
    Email: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
    ConfirmPassword: new FormControl('', Validators.required),
    IsHost: new FormControl(false),
    HostName: new FormControl(''),
    HostLocation: new FormControl(''),
    HostAbout: new FormControl(''),
    Languages: new FormControl(''),
    Profession: new FormControl(''),
    HostIdentityVerified: new FormControl(false),
  })
  async registerUser()
  {
    const Data = this.GetData();
    this.UserService.Register(Data).subscribe((response) => {
                                          console.log(response);
                                          if('Token' in response){
                                            const Auth = response as AuthModel;
                                            localStorage.setItem('usertoken',Auth.Token);
                                            if(this.UserService.GetRole() === 'Host')
                                            {
                                              this.HostService.RetrieveHostData().subscribe((response) => {
                                                const HostAuth = response as AuthModel;
                                                localStorage.setItem('hosttoken',HostAuth.Token);
                                              });
                                            }
                                            this.RoutingService.navigate(['/']).then(() => location.reload());
                                          }else{
                                            const ErrorResponse = response as error[];
                                            this.Username_Error = ErrorResponse.find(item => item.Variable === 'Username');
                                            this.Firstname_Error = ErrorResponse.find(item => item.Variable === 'FirstName');
                                            this.Lastname_Error = ErrorResponse.find(item => item.Variable === 'LastName');
                                            this.Phone_Error = ErrorResponse.find(item => item.Variable === 'PhoneNumber');
                                            this.Email_Error = ErrorResponse.find(item => item.Variable === 'Email');
                                            this.Password_Error = ErrorResponse.find(item => item.Variable === 'Password');
                                            this.ConfPassword_Error = ErrorResponse.find(item => item.Variable === 'ConfirmPassword');
                                            this.HostName_Error = ErrorResponse.find(item => item.Variable === 'HostName');
                                            this.HostAbout_Error = ErrorResponse.find(item => item.Variable === 'HostAbout');
                                            this.HostLocation_Error = ErrorResponse.find(item => item.Variable === 'HostLocation');
                                            this.Languages_Error = ErrorResponse.find(item => item.Variable === 'Languages');
                                            this.Profession_Error = ErrorResponse.find(item => item.Variable === 'Profession');
                                            this.ProfilePic_Error = ErrorResponse.find(item => item.Variable === 'ProfilePic');
                                            this.CredentialTaken_Error = ErrorResponse.find(item => item.Variable === '');
                                          };});
  }

  GetData(){
    const Data = new FormData();
    const formValue = this.RegisterForm.value;
    Data.append('Username',formValue.UserName || '');
    Data.append('FirstName',formValue.FirstName || '');
    Data.append('LastName',formValue.LastName || '');
    Data.append('Email',formValue.Email || '');
    Data.append('PhoneNumber',formValue.PhoneNumber || '');
    Data.append('Password',formValue.Password || '');
    Data.append('ConfirmPassword',formValue.ConfirmPassword || '');
    Data.append('IsHost',formValue.IsHost || false);
    Data.append('HostName',formValue.HostName || '');
    Data.append('HostLocation',formValue.HostLocation || '');
    Data.append('HostAbout',formValue.HostAbout || '');
    Data.append('Languages',formValue.Languages || '');
    Data.append('Languages',formValue.Languages || '');
    Data.append('Profession',formValue.Profession || '');
    Data.append('HostIdentityVerified',formValue.HostIdentityVerified);
    Data.append('ProfilePic',this.ProfilePic);

    return Data;
  }

  OnImageUpload(event:any){
    const file = event.target.files[0];
    if (file) {
      this.ProfilePic = file; 
    } else {
      this.imageError = 'No image selected.';
    }
  }
}