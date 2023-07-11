import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error } from '../interfaces/error';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private LoginURL = "https://localhost:7018/User/Login";
  private RegisterURL = "https://localhost:7018/User/Register";
  private LogoutURL = "https://localhost:7018/User/Logout";
  private EditURL = "https://localhost:7018/User/Edit/";
  private EditEmailURL = "https://localhost:7018/User/EditEmail";
  private User: User | undefined;

  constructor(private http: HttpClient) { }

  Register(UserName: string | undefined, FirstName: string | undefined,
    LastName: string | undefined, Email: string | undefined, PhoneNumber: string | undefined,
    Password: string | undefined, ConfirmPassword: string | undefined, IsHost: boolean | undefined): Observable<error[] | User> {
    const registrationData = {
      UserName,
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      Password,
      ConfirmPassword,
      IsHost
    };
    return this.http.post<error[] | User>(this.RegisterURL, registrationData);
  }
  Login(UserName: string | undefined, Password: string | undefined, RememberMe: boolean | false): Observable<User | error[]> {
    const LoginData = { UserName, Password, RememberMe };
    return this.http.post<User | error[]>(this.LoginURL, LoginData);
  }
  Logout(): Observable<string> { return this.http.get<string>(this.LogoutURL); }
  EditUser(username: string|undefined,firstname: string|undefined,lastname: string|undefined,
           phonenumber: string|undefined,bio: string|undefined):Observable<User | error[]>{
    const EditData = {
      username,
      firstname,
      lastname,
      phonenumber,
      bio
    }
    return this.http.post<User | error[]>(this.EditURL + this.User?.Id,EditData);
  }
  EditEmail(UserId: string|undefined,Email: string|undefined,Password: string|undefined,ConfirmPassword: string|undefined): Observable<User|error[]>{
    const EditEmail = {
      UserId,
      Email,
      Password,
      ConfirmPassword
    };
    return this.http.post<User|error[]>(this.EditEmailURL,EditEmail);
  }
  SetUserData(data: User) {
    if (data == undefined)
      return undefined;
    data.LoggedIn = true;
    localStorage.setItem('User', JSON.stringify(data))
  }
  GetUserData(): User | undefined {
    var temp = localStorage.getItem('User');
    if (temp == null)
      return undefined
    this.User = JSON.parse(temp) as User;
    return this.User
  }
  GetUserStatus(): boolean {
    if (this.GetUserData() == undefined)
      return false
    return true;
  }
  GetUsername(): string | undefined {
    if (this.GetUserData() == undefined)
      return undefined
    return this.User?.UserName;
  }
}
