// src/app/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  private apiUrl = 'https://weatherapp-bwoz.onrender.com/weather';

  constructor(private http: HttpClient) {}

  getCitySuggestions(query: string) {
    return this.http.get<any[]>(`https://weatherapp-bwoz.onrender.com/api/suggest?q=${query}`);
  }  
  
  getWeather(city: string) {
    return this.http.get<any>(`${this.apiUrl}?city=${city}`);
  }
}
