import { Injectable, inject } from '@angular/core';
import { Images } from '../interfaces/images';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House } from '../interfaces/house';
import * as FormData from 'form-data';
import { error } from '../interfaces/error';

@Injectable({
  providedIn: 'root'
})

export class HouseService {
  private GetHouses = 'https://localhost:7018/House/Index'
  private GetHouse = 'https://localhost:7018/House/Details/'
  private ImageURL = 'https://localhost:7018/House/GetImages/'
  private ThumbnailURL = 'https://localhost:7018/House/GetThumbnail/'
  private CreatePropertyURL = 'https://localhost:7018/House/Create/'
  private GetHostHousesURL = 'https://localhost:7018/Host/GetHouses/'
  private EditHouseURL = 'https://localhost:7018/House/Edit/'
  private DeleteHouseURL = 'https://localhost:7018/House/Delete/'
  constructor(private http: HttpClient) { }
  CreateProperty(UserId: string|undefined,Name: string | undefined,Summary: string | undefined,Thumbnail: File | undefined,Images: File[] | undefined):Observable<string|error[]>{
    const HouseForm = new FormData();
    HouseForm.append('Name',Name);
    HouseForm.append('Summary',Summary);
    HouseForm.append('Thumbnail',Thumbnail);
    for(let i = 0;i < Images?.length!;i++){
      HouseForm.append('Images',Images![i]);
    }
    return this.http.post<string|error[]>(this.CreatePropertyURL + UserId,HouseForm);
  }

getAllHousingLocations(): Observable<House[]> {
    return this.http.get<House[]>(this.GetHouses);
  }

getHousingLocationById(id: number): Observable<House> {
  return this.http.get<House>(this.GetHouse + id);
}

getHousingImagebyId(id: number): Observable<Images[]> {
  return this.http.get<Images[]>(this.ImageURL + id)
}

getThumbnailImageById(id: number): Observable<Images | undefined> {
  return this.http.get<Images>(this.ThumbnailURL + id);
}

GetHousesByHostId(HostId: number|undefined):Observable<House[]>{
    return this.http.get<House[]>(this.GetHostHousesURL + HostId);
  }

EditHouseById(Id : number | undefined,Name: string | undefined,Summary: string | undefined,Images: File[] | undefined):Observable<string|error[]>{
  const EditData = new FormData();
  EditData.append('Name',Name);
  EditData.append('Summary',Summary);
  if(Images != undefined){
    for(let i = 0;i < Images?.length;i++)
    {
      EditData.append('Images',Images[i]);
      console.log(Images[i]);
    }
  }
  return this.http.post<string|error[]>(this.EditHouseURL + Id,EditData);
}
DeleteHousebyId(Id:number,UserId:string | undefined):Observable<string>{
  const DeleteData = new FormData();
  DeleteData.append('UserId',UserId);
  return this.http.post<string>(this.DeleteHouseURL + Id,DeleteData);
}
}
