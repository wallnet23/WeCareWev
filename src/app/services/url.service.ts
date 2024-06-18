import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

// // usato per border sotto voce barra di menu
// private currenPageSubject = new Subject<string>();
// getInfoCurrenPage(): Observable<string> {
//   // console.log('ricevi menu');
//   return this.currenPageSubject.asObservable();
// }
// setInfoCurrenPage(page: string) {
//   // console.log('invia menu');
//   this.currenPageSubject.next(page);
// }

constructor() { }

  /**
     * Funzione restituisce l'url che si vede nella barra di ricerca es: /anagrafica/cfp/cliente/1
     * @param route
     * @returns
     */
  public getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }
  /**
  * Funzione restituisce l'url come passato in app-routing.module.ts es: /anagrafica/cfp/cliente/:id
  * @param route
  * @returns
  */
  public getConfiguredUrl(route: ActivatedRouteSnapshot): string {
    // console.log(route.params);
    return '/' + route.pathFromRoot
      .filter((v) => {
        return v.routeConfig;
      })
      .map((v) => {
        return v.routeConfig!.path;
      })
      .join('/');
  }
}
