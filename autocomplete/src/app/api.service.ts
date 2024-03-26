import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseURL = "https://restcountries.com/v3.1"

  constructor(public http: HttpClient) { }

  searchCountryByName(name: string, currency: string = 'None') {
    return name ? this.http.get(`${this.baseURL}/name/${name}`) : this.getCountryByCurrencyName(currency);
  }

  getCurrencies() {
    return this.http.get(`${this.baseURL}/all?fields=currencies`);
  }

  getCountryByCurrencyName(name: string) {
    return name != 'None' ? this.http.get(`${this.baseURL}/currency/${encodeURIComponent(name.toLowerCase())}`) : of([])
  }
}
