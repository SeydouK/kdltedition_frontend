import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface ReverseGeocodeResult {
  address: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly url = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  // Renvoie null si le service est indisponible ou ne connaît pas l'endroit :
  // l'appelant garde alors les coordonnées et laisse le client saisir son adresse.
  reverse(latitude: number, longitude: number): Observable<ReverseGeocodeResult | null> {
    return this.http
      .get<any>(this.url, {
        params: {
          format: 'jsonv2',
          lat: latitude,
          lon: longitude,
          zoom: 18,
          addressdetails: 1,
          'accept-language': 'fr',
        },
      })
      .pipe(
        map((response) => {
          const a = response?.address;
          if (!a) return null;

          const street = [a.house_number, a.road].filter(Boolean).join(' ');
          const area = a.neighbourhood || a.quarter || a.suburb || a.city_district || '';
          const city = a.city || a.town || a.village || a.municipality || a.county || a.state || '';
          const address = [street, area].filter(Boolean).join(', ');

          return address || city ? { address, city } : null;
        }),
        catchError(() => of(null)),
      );
  }
}
