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
    <div class="left-buttons">
      <a routerLink="../">
        <button class="profile-button" type="button">Profile</button>
      </a>
      <div *ngIf="User?.IsHost === true">
         <a routerLink="../Host">
          <button class="host-profile-button" type="button">Host Profile</button>
        </a>
        </div>
        <a routerLink="../Email">
          <button class="email-button" type="button">Email</button>
        </a>
        <a routerLink="../PersonalData">
          <button class="personal-data-button" type="button">Personal Data</button>
        </a>
    </div>
    <section class="change-password">
    <h2 class="section-heading">Change Password</h2>
      <form [formGroup]="PasswordForm" (submit)="ChangePassword()">
        <label for="password">Password</label>
      <input id="password" type="password" placeholder="Enter your old password" formControlName="OldPassword">
      <div class ="error"*ngIf="OldPassword_Error">
          <div *ngFor="let message of OldPassword_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="new-password">New Password</label>
      <input id="new-password" type="password" placeholder="Enter your new password" formControlName="NewPassword">
      <div class ="error"*ngIf="Password_Error">
          <div *ngFor="let message of Password_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="confirm-password">Confirm Password</label>
      <input id="confirm-password" type="password" placeholder="Confirm your new password" formControlName="ConfirmPassword">
      <div class ="error"*ngIf="ConfirmPassword_Error">
          <div *ngFor="let message of ConfirmPassword_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <button type="submit" class="primary">Submit</button>
      </form>
    </section>
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
