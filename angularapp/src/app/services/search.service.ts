import { Injectable } from '@angular/core';
import { House } from '../interfaces/house';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private Value: string | null = "";
  private text: string  = "";
  private filteredLocationList: House[] = [];

  SetValue(Value: string){localStorage.setItem('Search',Value);}

  GetValue(){return localStorage.getItem('Search');}

  filterByCity(HouseList:House[]): House[] {
    this.Value = this.GetValue();
    if(this.Value == null)
    {
      this.filteredLocationList = HouseList;
      return this.filteredLocationList
    }
    this.text = this.Value .toLowerCase();
    this.filteredLocationList = HouseList.filter(
      housingLocation => housingLocation?.City.toLowerCase().includes(this.text) ||
                         housingLocation?.Country.toLowerCase().includes(this.text) ||
                         housingLocation?.Neighbourhood.toLowerCase().includes(this.text) ||
                         housingLocation?.Street.toLowerCase().includes(this.text)
    );
    return this.filteredLocationList;
  }
}
