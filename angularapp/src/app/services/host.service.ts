import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Host } from '../interfaces/host';
import { error } from '../interfaces/error';
import { House } from '../interfaces/house';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private HostURL = "https://localhost:7018/Host/Create";
  private HostDataURL = "https://localhost:7018/Host/GetHost/";
  private EditHostURL = "https://localhost:7018/Host/Edit"
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
  EditHost(HostName: string | undefined, HostAbout: string | undefined, HostLocation: string | undefined, UserId: string | undefined): Observable<error[] | Host> {
    const HostData = {
      UserId,
      HostName,
      HostAbout,
      HostLocation
    };
    return this.http.post<error[] | Host>(this.EditHostURL, HostData);
  }
  SetHostData(data: Host) {
    if (data == undefined)
      return undefined;
    localStorage.setItem('Host', JSON.stringify(data));
  }
  GetHostData(): Host | undefined {
    var temp = localStorage.getItem('Host');
    if (temp == null)
      return undefined
    return JSON.parse(temp) as Host;
  }
  RetrieveHostData(id: string | undefined): Observable<Host | string> {
    return this.http.get<Host | string>(this.HostDataURL + id);
  }
}
