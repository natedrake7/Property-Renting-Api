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
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./email.component.css">
</head>

<body>
  <div class="container layout">
    <div class="row">
      <div class="col-md-1 buttons">
        <a routerLink="../">
            <button class="btn btn-primary" type="button">Back</button>
        </a>
        <a routerLink="../">
          <button class="btn btn-primary profile-button" type="button">Profile</button>
        </a>
        <div *ngIf="User?.IsHost">
          <a routerLink="../Host">
            <button class="btn btn-primary host-profile-button" type="button">Host Profile</button>
          </a>
          </div>
          <a routerLink="../Password">
            <button class="btn btn-primary password-button" type="button">Change Password</button>
          </a>
          <a routerLink="../PersonalData">
            <button class="btn btn-primary personal-data-button" type="button">Personal Data</button>
          </a>
      </div>
      <div class="col-md-6 email-col">
        <section class="email-edit">
          <h2 class="section-heading">Change Email</h2>
            <form [formGroup]="EmailForm" (submit)="EditEmail()">
              <div class="form-group">
                <label for="email">Your Email</label>
                <input id="email" class="form-control" type="email" [placeholder]="User?.Email" formControlName="Email">
                <div class ="error"*ngIf="Email_Error">
                  <div *ngFor="let message of Email_Error.Errors">
                    <p>{{message}}</p>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input id="password" class="form-control" type="password" placeholder="Enter your password" formControlName="Password">        
                <div class ="error"*ngIf="Password_Error">
                  <div *ngFor="let message of Password_Error.Errors">
                    <p>{{message}}</p>
                  </div>
                </div>
            </div>  
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input id="confirm-password" class="form-control" type="password" placeholder="Confirm your password" formControlName="ConfirmPassword">
              <div class ="error"*ngIf="ConfPassword_Error">
                <div *ngFor="let message of ConfPassword_Error.Errors">
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

  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </body>

</html>
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
