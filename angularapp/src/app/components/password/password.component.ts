import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import {RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { error } from 'src/app/interfaces/error';
import { AuthModel } from 'src/app/interfaces/auth-model';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Listing</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./password.component.css">
</head>
<body>
  <div class="container layout">
    <div class="row">
      <div class="col-md-1 nav-buttons">
        <a routerLink="../">
          <button class="btn btn-primary profile-button" type="button">Back</button>
        </a>
        <a routerLink="../">
          <button class="btn btn-primary profile-button" type="button">Profile</button>
        </a>
        <div *ngIf="User?.IsHost === true">
          <a routerLink="../Host">
            <button class="btn btn-primary host-profile-button" type="button">Host Profile</button>
          </a>
          </div>
          <a routerLink="../Email">
            <button class="btn btn-primary email-button" type="button">Email</button>
          </a>
          <a routerLink="../PersonalData">
            <button class="btn btn-primary personal-data-button" type="button">Personal Data</button>
          </a>
      </div>
      <div class="col-md-3 password">
        <section class="change-password">
          <h2 class="section-heading">Change Password</h2>
            <form [formGroup]="PasswordForm" (submit)="ChangePassword()">
              <div class="form-group">
                <label for="password">Password</label>
                <input id="password" class="form-control" type="password" placeholder="Enter your old password" formControlName="OldPassword">        
                <div class ="error"*ngIf="OldPassword_Error">
                  <div *ngFor="let message of OldPassword_Error.Errors">
                    <p>{{message}}</p>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="new-password">New Password</label>
                <input id="new-password" class="form-control" type="password" placeholder="Enter your new password" formControlName="NewPassword">
                <div class ="error"*ngIf="Password_Error">
                  <div *ngFor="let message of Password_Error.Errors">
                    <p>{{message}}</p>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input id="confirm-password" class="form-control" type="password" placeholder="Confirm your new password" formControlName="ConfirmPassword">
                <div class ="error"*ngIf="ConfirmPassword_Error">
                  <div *ngFor="let message of ConfirmPassword_Error.Errors">
                    <p>{{message}}</p>
                  </div>
                </div>
              </div>
            <button type="submit" class="btn btn-primary primary">Submit</button>
          </form>
        </section>
      </div>
    </div>
  </div>

  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>
  `,
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  UserService = inject(UserService);
  OldPassword_Error: error | undefined;
  Password_Error : error | undefined;
  ConfirmPassword_Error: error | undefined;
  User: User | undefined;
  PasswordForm = new FormGroup({
    OldPassword: new FormControl('', Validators.required),
    NewPassword: new FormControl('',Validators.required),
    ConfirmPassword: new FormControl('',Validators.required)
  })
  constructor(){
    this.User = this.UserService.GetUserData();
  }
  ChangePassword(){
    const formValue = this.PasswordForm.value;
    const OldPassword = formValue.OldPassword || '';
    const Password = formValue.NewPassword || '';
    const ConfirmPassword = formValue.ConfirmPassword || '';
    this.UserService.ChangePassword(OldPassword,Password,ConfirmPassword).subscribe((response) => {
      console.log(response);
      if('Token' in response){
        const data = response as AuthModel;
        location.reload();
      }
      else{
        const Error = response as error[];
        this.OldPassword_Error = Error.find(item => item.Variable === 'OldPassword');
        this.Password_Error = Error.find(item => item.Variable === 'Password');
        this.ConfirmPassword_Error = Error.find(item => item.Variable === 'ConfirmPassword');
      }
    })
  }

}
