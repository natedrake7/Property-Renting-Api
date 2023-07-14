import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { FormControl,FormGroup,ReactiveFormsModule,UntypedFormBuilder,Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { HostService } from 'src/app/services/host.service';
import { HttpClientModule,HttpClientXsrfModule } from '@angular/common/http';
import { error } from 'src/app/interfaces/error';
import { User } from 'src/app/interfaces/user';
import { Host } from '../../interfaces/host';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule, HttpClientModule,HttpClientXsrfModule],
  template: `
    <section class="Registration">
      <h2 class="section-heading">Register</h2>
      <form [formGroup]="RegisterForm" (submit)="registerUser()">
      <label for="username">Username</label>
        <input id="username" type="text" placeholder="Enter your Username" formControlName="UserName">
        <div class ="error"*ngIf="Username_Error">
          <div *ngFor="let message of Username_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="first-name">First Name</label>
        <input id="first-name" type="text" placeholder="Enter your First Name" formControlName="FirstName">
        <div class ="error"*ngIf="Firstname_Error">
          <div *ngFor="let message of Firstname_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="last-name">Last Name</label>
        <input id="last-name" type="text" placeholder="Enter your Last Name" formControlName="LastName">
        <div class ="error"*ngIf="Lastname_Error">
          <div *ngFor="let message of Lastname_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="email">Email</label>
        <input id="email" type="email" placeholder="Enter your Email" formControlName="Email">
        <div class ="error"*ngIf="Email_Error">
          <div *ngFor="let message of Email_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="phone">Phone Number</label>
        <input id="phone" type="text" placeholder="Enter your Phone Number" formControlName="PhoneNumber">
        <div class ="error"*ngIf="Phone_Error">
          <div *ngFor="let message of Phone_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="description">Description</label>
          <input id="description" type="text" placeholder="Enter your Description" formControlName="Description">

        <label for="password">Password</label>
        <input id="password" type="password" placeholder="Enter your Password" formControlName="Password">
        <div class ="error"*ngIf="Password_Error">
          <div *ngFor="let message of Password_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="confirm-password">Confirm Password</label>
        <input id="confirm-password" type="password" placeholder="Confirm your Password" formControlName="ConfirmPassword">
        <div class ="error"*ngIf="ConfPassword_Error">
          <div *ngFor="let message of ConfPassword_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="is-host">Host</label>
        <input id="is-host" type="checkbox" formControlName="IsHost">
          <div class ="host"*ngIf="RegisterForm.value.IsHost === true">
            <label for="host-name">Your Host Name</label>
              <input id="host-name" type="text" placeholder="Enter your Host name" formControlName="HostName">
              <div class ="error"*ngIf="HostName_Error">
              <div *ngFor="let message of HostName_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <label for="host-location">Your Location</label>
              <input id="host-location" type="text" placeholder="Enter your Location" formControlName="HostLocation">
              <div class ="error"*ngIf="HostLocation_Error">
              <div *ngFor="let message of HostLocation_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            <label for="host-about">Your Host Description</label>
              <input id="host-about" type="text" placeholder="Enter your description" formControlName="HostAbout">
                  <div class ="error"*ngIf="HostAbout_Error">
              <div *ngFor="let message of HostAbout_Error.Errors">
                <p>{{message}}</p>
              </div>
            </div>
            </div>
          <button type="submit" class="primary">Register</button>
        </form>
    </section>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  UserService = inject(UserService);
  HostService = inject(HostService);
  RoutingService: Router = inject(Router);
  Username_Error: error|undefined;
  Firstname_Error: error|undefined;
  Lastname_Error: error|undefined;
  Email_Error: error|undefined;
  Phone_Error: error|undefined;
  Password_Error: error|undefined;
  ConfPassword_Error: error|undefined;
  HostName_Error: error | undefined;
  HostLocation_Error : error | undefined;
  HostAbout_Error : error | undefined;

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
  })
  async registerUser()
  {
    const formValue = this.RegisterForm.value;
    const userName = formValue.UserName || ''; // Use empty string if null or undefined
    const firstName = formValue.FirstName || '';
    const lastName = formValue.LastName || '';
    const email = formValue.Email || '';
    const phoneNumber = formValue.PhoneNumber || '';
    const password = formValue.Password || '';
    const confirmPassword = formValue.ConfirmPassword || '';
    const isHost = formValue.IsHost || false;
    const hostname =  formValue.HostName || '';
    const hostlocation =  formValue.HostLocation || '';
    const hostabout =  formValue.HostAbout  || '';
    this.UserService.Register(userName,
                              firstName,
                              lastName,
                              email,
                              phoneNumber,
                              password,
                              confirmPassword,
                              isHost,hostname,hostlocation,hostabout).subscribe((response) => {
                                          if('UserName' in response){
                                            this.UserService.SetUserData(response as User);
                                            if(this.UserService.GetUserData()?.IsHost){
                                              this.HostService.RetrieveHostData(this.UserService.GetUserData()?.Id).subscribe((response) => {
                                                if(typeof response  != 'string'){
                                                  const data = response as Host;
                                                  this.HostService.SetHostData(data);
                                                  this.RoutingService.navigate(['/']);  
                                                };
                                              });
                                            }
                                            else
                                              this.RoutingService.navigate(['/']);  
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
                                          };});
  }
}