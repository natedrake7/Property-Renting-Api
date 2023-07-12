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
        <a routerLink="../Password">
          <button class="password-button" type="button">Change Password</button>
        </a>
    </div>
    <div class="personal-data">
      <h2>Your Personal Data</h2>
        <p>Would you like to download your personal data as Json?</p>
          <button class="download-data" type="button" (click)="DownloadData()">Download</button>
        <p>Would you like to delete your personal data?</p>
        <p>Warning this action cannot be revoked!</p>
        <button class="delete-data" type="button" (click)="SetBool()">Delete</button>
      <section class="confirm-delete" *ngIf="Delete">
        <form [formGroup]="PasswordForm" (submit)="DeleteData()">
          <label for="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" formControlName="Password">
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
    </div>
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
  SetBool(){
    this.Delete = true;
    console.log(this.Delete);
  }
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
