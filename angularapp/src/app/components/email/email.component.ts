import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { error } from 'src/app/interfaces/error';
import { AuthModel } from 'src/app/interfaces/auth-model';

@Component({
  selector: 'app-email',
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
        <a routerLink="../Password">
          <button class="password-button" type="button">Change Password</button>
        </a>
        <a routerLink="../PersonalData">
          <button class="personal-data-button" type="button">Personal Data</button>
        </a>
    </div>
    <section class = "email-edit">
    <h2 class="section-heading">Change Email</h2>
      <form [formGroup]="EmailForm" (submit)="EditEmail()">
      <label for="email">Your Email</label>
      <input id="email" type="email" [placeholder]="User?.Email" formControlName="Email">
      <div class ="error"*ngIf="Email_Error">
          <div *ngFor="let message of Email_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="password">Password</label>
      <input id="password" type="password" placeholder="Enter your password" formControlName="Password">
      <div class ="error"*ngIf="Password_Error">
          <div *ngFor="let message of Password_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="confirm-password">Confirm Password</label>
      <input id="confirm-password" type="password" placeholder="Confirm your password" formControlName="ConfirmPassword">
      <div class ="error"*ngIf="ConfPassword_Error">
          <div *ngFor="let message of ConfPassword_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <button type="submit" class="primary">Submit</button>
      </form>
    </section>
  `,
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  UserService = inject(UserService);
  User: User |undefined;
  Email_Error: error | undefined;
  Password_Error: error | undefined;
  ConfPassword_Error: error | undefined;
  EmailForm = new FormGroup({
    Email: new FormControl('', Validators.required),
    Password: new FormControl('',Validators.required),
    ConfirmPassword: new FormControl('',Validators.required),
  })
  constructor(){
    this.User = this.UserService.GetUserData();
  }
  EditEmail(){
    const formValue = this.EmailForm.value;
    const Email = formValue.Email || '';
    const Password = formValue.Password || '';
    const ConfirmPassword = formValue.ConfirmPassword || '';
    this.UserService.EditEmail(this.User?.Id,Email,Password,ConfirmPassword).subscribe((response) =>{
      if('Token' in response)
      {
        const token = response as AuthModel;
        localStorage.setItem('usertoken',token.Token);
        location.reload();
      }
      else{
        const Error = response as error[];
        this.Email_Error = Error.find(item => item.Variable === "Email");
        this.Password_Error = Error.find(item => item.Variable === "Password");
        this.ConfPassword_Error = Error.find(item => item.Variable === "ConfirmPassword");
      }
    })

  }
}
