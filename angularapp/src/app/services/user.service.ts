import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error } from '../interfaces/error';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthModel } from '../interfaces/auth-model';
import { HttpHeaders } from '@angular/common/http';
import * as FormData from 'form-data';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private LoginURL = "https://localhost:7018/User/Login";
  private RegisterURL = "https://localhost:7018/User/Register";
  private LogoutURL = "https://localhost:7018/User/Logout";
  private EditURL = "https://localhost:7018/User/Edit/";
  private EditEmailURL = "https://localhost:7018/User/EditEmail";
  private ChangePasswordURL = "https://localhost:7018/User/ChangePassword/";
  private DeleteURL = "https://localhost:7018/User/Delete/";
  private DeleteConfirmedURL = "https://localhost:7018/User/DeleteConfirmed/";
  private User: User = {};

  constructor(private http: HttpClient) { }

  Register(Data: FormData | undefined): Observable<AuthModel | error[]> {
    return this.http.post<AuthModel | error[]>(this.RegisterURL,Data);
  }
  Login(UserName: string | undefined, Password: string | undefined, RememberMe: boolean | false): Observable<AuthModel | error[]> {
    const LoginData = { UserName, Password, RememberMe };
    return this.http.post<AuthModel | error[]>(this.LoginURL, LoginData);
  }
  Logout(): Observable<string> { 
    const token = this.GetToken('usertoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    localStorage.clear(); return this.http.get<string>(this.LogoutURL,{headers:headers}); 
  }
  EditUser(username: string|undefined,firstname: string|undefined,lastname: string|undefined,
           phonenumber: string|undefined,bio: string|undefined):Observable<AuthModel | error[]>{
  const token = localStorage.getItem('usertoken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const EditData = {
      username,
      firstname,
      lastname,
      phonenumber,
      bio
    }
    return this.http.post<AuthModel | error[]>(this.EditURL + this.User?.Id,EditData,{headers: headers});
  }
  EditEmail(UserId: string|undefined,Email: string|undefined,Password: string|undefined,ConfirmPassword: string|undefined): Observable<AuthModel|error[]>{
    const EditEmail = {
      UserId,
      Email,
      Password,
      ConfirmPassword
    };
    return this.http.post<AuthModel|error[]>(this.EditEmailURL,EditEmail);
  }
  ChangePassword(OldPassword: string|undefined,Password: string|undefined,ConfirmPassword: string|undefined): Observable<AuthModel|error[]>{
    const ChangePassword = {
      OldPassword,
      Password,
      ConfirmPassword
    };
    return this.http.post<AuthModel | error[]>(this.ChangePasswordURL + this.User?.Id,ChangePassword);
  }
  DeleteUser(Password: string|undefined,ConfirmPassword: string|undefined):Observable<error[] | string>{
    const PasswordConfirm = {
      Password,
      ConfirmPassword
    };
    return this.http.post<error[] | string>(this.DeleteURL + this.User?.Id,PasswordConfirm);
  }
  DeleteConfirmedUser():Observable<error | string>{
    return this.http.delete<error | string>(this.DeleteConfirmedURL + this.User?.Id);
  }
  GetUserData(): User | undefined {
    const token = this.GetToken('usertoken');
    if(!token)
      return undefined;
    this.User.Id = token['Id'];
    this.User.UserName = token['username'];
    this.User.FirstName = token['FirstName'];
    this.User.LastName = token['LastName'];
    this.User.PhoneNumber = token['PhoneNumber'];
    this.User.Email = token['Email'];
    this.User.Bio = token['Bio'];
    return this.User
  }

  GetUserStatus(): boolean {
    if (!this.GetToken('usertoken'))
      return false
    return true;
  }

  GetUsername(): string | undefined {
    const token = this.GetToken('usertoken');
    if(!token)
      return undefined;
    return token['username'];
  }

  GetRole():string | undefined{
    const token = this.GetToken('usertoken');
    if(!token)
      return undefined;
    return token['Role'];
  }

  GetToken(TokenId: string):{[key: string]: string} | undefined
  {
    const AuthToken = localStorage.getItem(TokenId);
    if(!AuthToken)
      return undefined;
    return jwt_decode(AuthToken) as { [key: string] : string };
  }
}
