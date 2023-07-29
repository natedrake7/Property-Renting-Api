import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
private DeleteImageURL = 'https://localhost:7018/HouseImages/Delete/';
private EditThumbnailURL = 'https://localhost:7018/House/SetThumbnail/';
  constructor(private http:HttpClient) { }
  DeleteImage(Id:number):Observable<string>{
    return this.http.get<string>(this.DeleteImageURL + Id);
  }
  SetThumbnail(id:number | undefined,ImageId : number):Observable<string>{
    return this.http.post<string>(this.EditThumbnailURL + id,ImageId);
  }
}
