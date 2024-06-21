import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Country } from '../interfaces/country';

@Injectable({
  providedIn: 'root'
})
export class ConnectServerService {

  constructor(private http: HttpClient) { }

  postRequest<T>(urlServer: string, urlFunction: string, parametri: object): Observable<any> {
    return this.http.post(urlServer + urlFunction, parametri);
  }
  getRequest<T>(urlServer: string, urlFunction: string, parametri: any): Observable<any> {
    return this.http.get(urlServer + urlFunction, {
      params: parametri,
      // observe: 'response'
      // observe: 'events'
    });
  }
  async getRequestAsync<T>(urlServer: string, urlFunction: string, parametri: any): Promise<any> {
    const chiamata$ = this.http.get(urlServer + urlFunction,
        {
            params: parametri,
            // observe: 'response'
            // observe: 'events'
        }).pipe(
        // timeout(4000),
        // catchError(this.handleError)
    );
    // const awaitRequest = await chiamata$.toPromise();
    // return await awaitRequest;
    return await lastValueFrom(chiamata$);

}
  public getTimeoutForRequest(request: HttpRequest<any>): number {
    // Puoi implementare la logica per ottenere il timeout in base al tipo di richiesta.
    // Ad esempio, puoi controllare il metodo della richiesta (GET, POST, ecc.) o l'URL e restituire il timeout appropriato.
    // console.log(request.method);
    if (request.method === 'GET') {
      return 40000; // Timeout di 40 secondi per le richieste GET
    } else if (request.method === 'POST') {
      // return 60000; // Timeout di 60 secondi per le richieste POST
      return 60000; // Timeout di 60 secondi per le richieste POST
    } else {
      return 30000; // Timeout di 30 secondi per gli altri tipi di richieste (PUT, DELETE, ecc.)
    }
  }

  getRequestCountryData(): Observable<Country[]> {
    return this.getRequest<Country[]>('https://restcountries.com/v3.1/','all?fields=name,flags,cca2,ccn3',{})
      .pipe(map((val: Country[]) => val.sort((a,b) => a.name.common.localeCompare(b.name.common))));
  }
}
