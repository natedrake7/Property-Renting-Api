import { Injectable, inject } from '@angular/core';
import { Images } from '../interfaces/images';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House } from '../interfaces/house';

@Injectable({
  providedIn: 'root'
})

export class HouseService {
  URL = 'https://localhost:7023/UserHouses/Index'
  URL2 = 'https://localhost:7023/UserHouses/Details'
  ImageURL = 'https://localhost:7023/UserHouses/GetImages'
  ThumbnailURL = 'https://localhost:7023/UserHouses/GetThumbnail'
  housingLocationList: House[] = [];
  constructor(private http: HttpClient) { }

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
  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}
                , lastName: ${lastName}, email: ${email}.`);
  }
}
