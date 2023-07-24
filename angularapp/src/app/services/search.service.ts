import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private Value: string = "";

  SetValue(Value: string){this.Value = Value;}
  GetValue(){return this.Value}
}
