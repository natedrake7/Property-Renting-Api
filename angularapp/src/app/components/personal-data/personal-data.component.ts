import { Component, Host, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { HostService } from 'src/app/services/host.service';
import { error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  template: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="./personal-data.component.css">
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
          <a routerLink="../Password">
            <button class="btn btn-primary password-button" type="button">Change Password</button>
          </a>
      </div>
      <div class="col-md-3 personal-data">
        <h3>Your Personal Data</h3>
        <h6>Would you like to download your personal data as Json?</h6>
        <button class="btn btn-primary download-data" type="button" (click)="DownloadData()">Download</button>
        <h6 class="delete-header">Would you like to delete your account?</h6>
          <button class="btn btn-primary delete-data" type="button" (click)="SetBool()">Delete</button>
          <section class="confirm-delete" *ngIf="Delete">
            <p class="error">Would you like to delete your personal data?</p>
            <p class="error">Warning this action cannot be revoked!</p>
            <form [formGroup]="PasswordForm" (submit)="DeleteData()">
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
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent {
  UserService = inject(UserService);
  HostService = inject(HostService);
  RoutingService = inject(Router);
  User: User|undefined;
  Delete : boolean| undefined;
  Password_Error : error | undefined;
  ConfirmPassword_Error: error | undefined;
  Delete_Error : error | undefined;
  PasswordForm = new FormGroup({
    Password: new FormControl('',Validators.required),
    ConfirmPassword: new FormControl('',Validators.required)
  })
  constructor(){
    this.User = this.UserService.GetUserData();
    this.Delete = false;
  }
  SetBool(){ this.Delete = !this.Delete; }
  DownloadData(){
    var json = JSON.stringify(this.User);
    const blob = new Blob([json], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    link.download = 'UserData.json';
    link.click();

    URL.revokeObjectURL(link.href);
  }
  DeleteData(){
    const formValue = this.PasswordForm.value;
    const Password = formValue.Password || '';
    const ConfirmPassword = formValue.ConfirmPassword || ''; //Must first delete host,which means delete houses,which means delete reviews and images etc.....
                                                            //First Implement to add those and then create this.
    this.UserService.DeleteUser(Password,ConfirmPassword).subscribe((response)=> {
      console.log(response);
      if (typeof response === 'string') {
        this.UserService.DeleteConfirmedUser().subscribe((response2) =>{
          if (typeof response2 === 'string') {
            localStorage.clear();
            this.RoutingService.navigate(['/']);
        }
        else
          this.Delete_Error = response2 as error;
        });
      }
      else{
        const Error = response as error[];
        this.Password_Error = Error.find(item => item.Variable === 'Password');
        this.ConfirmPassword_Error = Error.find(item => item.Variable === 'ConfirmPassword');
      }
    })

  }
}
