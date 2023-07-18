import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _authChangeSub = new Subject<boolean>();
  public authChanged = this._authChangeSub.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    if(token && !this.jwtHelper.isTokenExpired(token))
      return true;
    return false;
  }
}
