import { Component, inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  template: `
  
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navbar</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="./app.component.css">
  </head>

  <body>
    <nav class="navbar justify-content-center navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand brand" [routerLink]="['/']">
          <img class="brand-logo" src="/assets/main-image.png" alt="logo" aria-hidden="true">
        </a>
        <ul class="nav navbar-nav">
          <div class="form-group input-group search-container">
            <form action="/" (submit)="FilterByCity(filter.value)">
              <input type="text" class="form-control search-bar" placeholder="Filter by Country,City,Neighbourhood or Street..." #filter>
              <button class="btn btn-primary ml-2 searchbutton" type="submit">Search</button>
            </form>
          </div>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li class="nav-item" *ngIf="!UserStatus">
            <button class="btn btn-primary register" [routerLink]="['Register']">Register</button>
            <button class="btn btn-primary login" [routerLink]="['Login']">Login</button>
          </li>
          <li class="nav-item" *ngIf="UserStatus">
            <button class="btn btn-primary user-profile" [routerLink]="['Profile']">Hello {{ this.Username }}</button>
            <button class="btn btn-primary logout" (click)="Logout()">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
    <section class="content">
      <router-outlet></router-outlet>
    </section>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </body>
</html>
`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  UserService = inject(UserService);
  RoutingService = inject(Router);
  SearchService = inject(SearchService);
  UserStatus: boolean = false;
  StatusCheck: boolean = false;
  Username: string | undefined;
  title = "airbnb";
  constructor(){
    this.UserStatus = this.UserService.GetUserStatus();
    this.Username = this.UserService.GetUsername();
  }
  Logout() {
    if (this.UserService.GetUserStatus())
      this.UserService.Logout().subscribe(() => { localStorage.removeItem('User'); location.reload(); });
  }
  FilterByCity(filterValue: string){this.SearchService.SetValue(filterValue);}
}
