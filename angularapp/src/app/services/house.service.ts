import { Injectable, inject } from '@angular/core';
import { Images } from '../interfaces/images';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House } from '../interfaces/house';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class HouseService {
  private URL = 'https://localhost:7018/House/Index'
  private URL2 = 'https://localhost:7018/House/Details'
  private ImageURL = 'https://localhost:7018/House/GetImages'
  private ThumbnailURL = 'https://localhost:7018/House/GetThumbnail'
  private CreatePropertyURL = 'https://localhost:7018/House/Create/'
  private GetHostHousesURL = 'https://localhost:7018/Host/GetHouses/'
  housingLocationList: House[] = [];
  constructor(private http: HttpClient) { }
  CreateProperty(UserId: string|undefined,Name: string | undefined,Summary: string | undefined):Observable<string>{
    const HouseForm = {
      Name,
      Summary
    };
    return this.http.post<string>(this.CreatePropertyURL + UserId,HouseForm);
  }

  getAllHousingLocations(): Observable<House[]> {
    return this.http.get<House[]>(this.URL);
  }

  async getHousingLocationById(id: number): Promise<House | undefined> {
    try {
      const data = await fetch(`${this.URL2}/${id}`);
      console.log(data);
      if (data.ok) {
        return await data.json() ?? {};
      }
      else {
        throw new Error('Failed to fetch house.');
      }
    }
    catch (error) {
      console.error(error);
      return undefined;
    }
  }
  async getHousingImagebyId(id: number): Promise<Images[]> {
    try {
      const data = await fetch(`${this.ImageURL}/${id}`);
      console.log(data);
      if (data.ok) {
        return await data.json() ?? {};
      }
      else {
        throw new Error('Failed to fetch house.');
      }
    }
    catch (error) {
      console.error(error);
      return [];
    }
  }
  async getThumbnailImageById(id: number): Promise<Images | undefined> {
    try {
      const data = await fetch(`${this.ThumbnailURL}/${id}`);
      console.log(data);
      if (data.ok) {
        return await data.json() ?? {};
      }
      else {
        throw new Error('Failed to fetch Thumbnail.');
      }
    }
    catch (error) {
      console.error(error);
      return undefined;
    }
  }
  GetHousesByHostId(HostId: number|undefined):Observable<House[]>{
    return this.http.get<House[]>(this.GetHostHousesURL + HostId);
  }
  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}
                , lastName: ${lastName}, email: ${email}.`);
  }
}
