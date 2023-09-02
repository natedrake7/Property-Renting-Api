import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { error } from 'src/app/interfaces/error';
import { User } from 'src/app/interfaces/user';
import { HostService } from 'src/app/services/host.service';
import { AuthModel } from 'src/app/interfaces/auth-model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Listing</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="./login.component.css">
  </head>
  <body>
   <div class="container login">
    <div class="details">
      <h2 class="section-heading">Login</h2>
      <form [formGroup]="LoginForm" (submit)="LoginUser()">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username-box" class="form-control" type="text" formControlName="UserName" placeholder="Enter your Username">
        </div>
        <div class ="error"*ngIf="Username_Error">
          <div *ngFor="let message of Username_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" class="form-control" type="password" formControlName="Password" placeholder="Enter your Password">
        </div>
        <div class ="error"*ngIf="Password_Error">
          <div *ngFor="let message of Password_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <div class="row buttons">
          <div class="col-md-6">
            <div class="form-group">
              <label for="remember-me">Remember Me</label>
              <input id="remember-me-box" type="checkbox" formControlName="RememberMe">
            </div>
          </div>
          <div class="col-md-6">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </div>
        <div class ="error"*ngIf="Login_Error">
          <div *ngFor="let message of Login_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
      </form>
      </div>
    </div>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  UserService = inject(UserService);
  RoutingService: Router = inject(Router);
  HostService = inject(HostService);
  Username_Error: error | undefined;
  Password_Error: error | undefined;
  Login_Error: error | undefined;
  UserData: User | undefined;

  LoginForm = new FormGroup({
    UserName: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
    RememberMe: new FormControl(false, Validators.required)
  });
  async LoginUser() {
    const formValue = this.LoginForm.value;
    const userName = formValue.UserName || '';
    const password = formValue.Password || '';
    const RememberMe = formValue.RememberMe || false;
    if (this.UserService.GetUserStatus() === false) {
      this.UserService.Login(userName, password, RememberMe).subscribe((response) => {
        if('Token' in response){
          const Auth = response as AuthModel;
          localStorage.setItem('usertoken',Auth.Token);
          if(this.UserService.GetRole() === 'Host'){
            this.HostService.RetrieveHostData().subscribe((response2) => {
              if('Token' in response2){
                const Auth = response2 as AuthModel;
                localStorage.setItem('hosttoken',Auth.Token);
              }
              this.RoutingService.navigate(['/']).then(() => location.reload());
            }); 
          }
          else
            this.RoutingService.navigate(['/']).then(() => location.reload());
        }
        else {
          const ErrorResponse = response as error[];
          console.log(response);
          this.Login_Error = ErrorResponse.find(item => item.Variable === "Account");
          this.Username_Error = ErrorResponse.find(item => item.Variable === "UserName");
          this.Password_Error = ErrorResponse.find(item => item.Variable === "Password");
        }
      });
    }
  }
}
