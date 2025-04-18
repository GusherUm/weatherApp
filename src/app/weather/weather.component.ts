import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent { 
  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';

  searchSubject = new Subject<string>();
  suggestions: any[] = [];

  constructor(private weatherService: WeatherService) {}

  onCityInput() {
    if (this.city.length >= 2) {
      this.weatherService.getCitySuggestions(this.city).subscribe(
        (data: any[]) => {
          this.suggestions = data
            .filter(item => item.name && item.country) // filters bad entries
            .map(item => ({
              name: item.name,
              country: item.country,
              state: item.state || ''
            }));
        },
        (error) => {
          console.error('Suggestion error:', error);
        }
      );
      
    } else {
      this.suggestions = [];
    }
  }

  // selectSuggestion(cityName: string) {
  //   this.city = cityName;
  //   this.suggestions = [];
  //   this.fetchWeather(); // Optional: auto-fetch on selection
  // }

  getCardClass(): string {
    if (!this.weatherData) return '';
  
    const temp = this.weatherData.temperature;
  
    if (temp > 33) return 'hot-glow';
    if (temp < 20) return 'cold-glow';
    return 'normal-glow';
  }

  fetchWeather() {
    this.weatherService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.errorMessage = '';
      },
      (error) => {
        this.weatherData = null;
        this.errorMessage = 'City not found';
      }
    );
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.weatherService.getCitySuggestions(query))
    ).subscribe(data => {
      this.suggestions = data;
    });
  }
  
  onInputChange(value: string) {
    this.city = value;
    if (value.length > 1) {
      this.searchSubject.next(value);
    } else {
      this.suggestions = [];
    }
  }
  
  selectSuggestion(selectedName: string) {
    this.city = selectedName;
    this.suggestions = []; // clear dropdown
    setTimeout(() => {
      this.fetchWeather();
    }, 100); // give time for input update
  }
  
}
