import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { catchError, debounceTime, EMPTY, filter, fromEvent, map, merge, mergeAll, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { Country } from '../models/Country';
import { Currency } from '../models/Currency';
import { removeDuplicates } from '../utils';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput?: ElementRef;
  @ViewChild('dropdown') dropdown?: ElementRef
  @ViewChild('select') select?: ElementRef;
  selectedCountry?: Country;
  countries$?: Observable<any>;
  search: string = ""
  closed: boolean = true;
  currencies$?: Observable<any>;
  currency: Currency = {name: 'None', symbol: 'None'};
  currenciesAndCountries?: any;

  constructor(public api: ApiService) {}
  
  ngAfterViewInit() {
    this.countries$ = merge(
      fromEvent(this.searchInput?.nativeElement, 'input').pipe(
        map((e: any) => e.target.value),
        debounceTime(500),
        switchMap(value => this.api.searchCountryByName(value, this.currency.name).pipe(catchError(x => of([])))),
        map((array: any) => {
          if (this.currency?.name != 'None') {
            return array.filter((x: any) => {
              let res = false;
              for (let c of Object.keys(x.currencies)) {
                if (x.currencies[c].name == this.currency.name) {
                  res = true; 
                  break;
                }
              }
              return res;
            })
          }
          return array;
        })
      ),
      fromEvent(this.select?.nativeElement, 'change').pipe(
        map((e: any) => e.target.value),
        switchMap(value => this.api.getCountryByCurrencyName(this.currency.name).pipe(catchError(x => of([])))),
        tap(v => {
          const el = this.searchInput?.nativeElement;
          el.value = "";
          this.closed = true;
        }),
      ))
    this.currencies$ = this.api.getCurrencies().pipe(
      map((array: any) => {
        return removeDuplicates(array.map((x: any) => {
          const curr: any = Object.values(x)[0]
          for (let a in curr) return curr[a];
          return {}
        }))
      })
    )
  }

  @HostListener('window:click', ['$event'])
  clickout(event: Event) {
    if(!this.dropdown?.nativeElement.contains(event.target) &&
      !this.searchInput?.nativeElement.contains(event.target)) {
      this.closed = true;
    }
  }

  selectCountry(country: Country){
    this.closed = true
    this.selectedCountry = country
  }

  selectCurrency(){
    if (this.currency.name != "None") {
      this.countries$ = this.api.getCountryByCurrencyName(this.currency.name);
    }
  }
}
