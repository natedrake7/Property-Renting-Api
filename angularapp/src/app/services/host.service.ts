import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Host } from '../interfaces/host';
import { error } from '../interfaces/error';
import jwt_decode from 'jwt-decode';
import { AuthModel } from '../interfaces/auth-model';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private HostURL = "https://localhost:7018/Host/Create";
  private HostDataURL = "https://localhost:7018/Host/GetHost/";
  private EditHostURL = "https://localhost:7018/Host/Edit/"
  private Host: Host = {};
  constructor(private http: HttpClient) { }
  CreateHost(HostName: string | undefined, HostAbout: string | undefined, HostLocation: string | undefined, UserId: string | undefined): Observable<error[] | Host> {
    const HostData = {
      UserId,
      HostName,
      HostAbout,
      HostLocation
    };
    return this.http.post<error[] | Host>(this.HostURL, HostData);
  }
  EditHost(HostName: string | undefined, HostAbout: string | undefined, HostLocation: string | undefined, UserId: string | undefined): Observable<AuthModel | error[]> {
    const HostData = {
      HostName,
      HostAbout,
      HostLocation
    };
    const Authtoken = this.GetToken('usertoken');
    const token = localStorage.getItem('usertoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<AuthModel | error[]>(this.EditHostURL + Authtoken['Id'], HostData,{headers : headers});
  }

  GetHostData(): Host | undefined {
    const token = this.GetToken('hosttoken');
    if (!token)
      return undefined
    this.Host.Id = parseInt(token['Id']);
    this.Host.HostName = token['username'];
    this.Host.HostAbout = token['About'];
    this.Host.HostLocation = token['Location'];
    return this.Host;
  }
  
  GetHostStatus() : boolean{
    if (!this.GetToken('hosttoken'))
    return false
  return true;
  }

  RetrieveHostData(): Observable<AuthModel | error[]> {
    const token = localStorage.getItem('usertoken');
    const AuthToken = this.GetToken('usertoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<AuthModel | error[]>(this.HostDataURL + AuthToken['Id'],{headers: headers});
  }
  GetToken(TokenId: string):{[key: string]: string}
  {
    const AuthToken = localStorage.getItem(TokenId);
    return jwt_decode(AuthToken!) as { [key: string]: string };
  }
}
