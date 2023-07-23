import { Component, inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <main>
    <header class="brand-name">
      <a [routerLink]="['/']">
        <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true">
      </a>
    </header>
    <div class="row">
      <div class="col-md-6">
        <ng-container *ngIf="showSearchButton()">
          <div class="search-wrapper">
            <form class="search d-flex">
              <div class="form-group flex-grow-1">
                <form action="/">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Filter by city" #filter>
                      <div class="input-group-append">
                        <button class="btn btn-primary searchbutton" type="submit">Search</button>
                      </div>
                  </div>
                </form>
              </div>
            </form>
          </div>
        </ng-container>
      </div>
      <div class="col-md-6 user">
          <div *ngIf="!UserStatus">
            <a [routerLink]="['Register']">
              <button class="btn btn-primary register" type="button">Register</button>
            </a>
            <a [routerLink]="['Login']">
              <button class="btn btn-primary login" type="button">Login</button>
            </a>
          </div>
          <div *ngIf="UserStatus">
            <a [routerLink]="['Profile']">
              <button class="btn btn-primary user-profile" type="button">Hello {{ this.Username }}</button>
            </a>
            <button class="btn btn-primary logout" type="button" (click)="Logout()">Logout</button>
          </div>
      </div>
    </div>
    <section class="content">
    <router-outlet></router-outlet>
    </section>
  </main>
`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  UserService = inject(UserService);
  RoutingService = inject(Router);
  UserStatus: boolean = false;
  StatusCheck: boolean = false;
  Username: string | undefined;
  title = "airbnb";
  constructor(){
    this.UserStatus = this.UserService.GetUserStatus();
    this.Username = this.UserService.GetUsername();
  }
  Logout() {
    if (this.UserService.GetUserStatus() == true)
      this.UserService.Logout().subscribe(() => { localStorage.removeItem('User'); location.reload(); });
  }
  showSearchButton(){
    return this.RoutingService.url === '/' || this.RoutingService.url === '/details/'
  }
}
