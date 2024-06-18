import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Connect } from '../classes/constants';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpInfoConnectService {

  apiUrl = `${Connect.IPINFO_URL}?token=${Connect.IPINFO_API_TOKEN}`;
  constructor(private http: HttpClient) { }

  getLanguage(): Observable<string> {
    return this.http.get(this.apiUrl).pipe(
      map((response: any) => {
        // Estrarre la lingua preferita dal servizio di geolocalizzazione
        const language = response.country.toLowerCase(); // Esempio: utilizzare il paese come lingua
        // console.log(response);
        return language;
      }),
      catchError((error) => {
        console.error('Error getting location:', error);
        return of('en'); // Fallback a una lingua predefinita in caso di errore
      })
    );
  }

}
