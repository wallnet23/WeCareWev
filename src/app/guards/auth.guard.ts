import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UrlService } from '../services/url.service';
import { Store } from '@ngrx/store';
import { UserState } from '../ngrx/user/user.reducer';
import { catchError, filter, map, of, take } from 'rxjs';
import { PermissionsUser } from '../interfaces/permissions-user';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const urlService = inject(UrlService);
  // const connectServerService = inject(ConnectServerService);
  const router = inject(Router);
  const url = urlService.getResolvedUrl(route);
  // console.log('url:', url);
  const url_withparams = urlService.getConfiguredUrl(route);
  const store = inject(Store<{ user: UserState }>);
  // console.log('url_withparams:', url_withparams);

  if (authService.isLoggedIn()) {
    return store.select(state => state.user.permissions).pipe(
      filter(permissions => !!permissions), // Aspetta che i permessi siano caricati
      take(1), // Prendi solo il primo valore non undefined/null
      map((val: PermissionsUser) => {
        // console.log('1 perm', val);
        let path = url;
        let path_composer = url_withparams;
        if (val && val.pages_access) {
          // console.log('2 perm');
          if (path.charAt(0) === '/') {
            path = path.substring(1);
          }
          if (path_composer.charAt(0) === '/') {
            path_composer = path_composer.substring(1);
          }

          const array_pathcomposer = path_composer.split('/');
          const array_path = path.split('/');

          let finalUrl: string;

          if (path_composer.includes(':id')) {
            finalUrl = '';
            array_pathcomposer.forEach((pathc, index) => {
              if (pathc.charAt(0) === ':') {
                if (pathc !== ':id') {
                  finalUrl += array_path[index] + '/';
                } else {
                  finalUrl += pathc + '/';
                }
              } else {
                finalUrl += pathc + '/';
              }
            });
            if (finalUrl.charAt(finalUrl.length - 1) === '/') {
              finalUrl = finalUrl.substring(0, finalUrl.length - 1);
            }
          } else {
            finalUrl = path;
          }

          const objectsArray = val.pages_access;
          const foundObject = objectsArray.find(obj => obj.path === finalUrl);
          if (foundObject) {
            return true;
          } else {
            return router.createUrlTree(['deniedAccess']);
          }
        } else {
          // console.log('3 perm');
          return router.createUrlTree(['deniedAccess']);
        }
      }),
      catchError(() => {
        // console.log('4 perm');
        return of(router.createUrlTree(['deniedAccess']));
      })
    );
    // return connectServerService.getRequestAsync(Connect.urlServerLaraApi, 'user/checkPageAccess',
    //   {
    //     path: url,
    //     path_composer: url_withparams
    //   }).then(
    //     (esito: ApiResponse<{ access_page: { check: number; title: string | null; readonly: number; } }>) => {
    //       // console.log('esito',esito);
    //       if (esito.data && esito.data.access_page) {
    //         // console.log('url', url);
    //         // if ((url == '/login' || url == 'signup') && authService.isLoggedIn()) {
    //         //   router.navigate(['systemsList']);
    //         //   return false;
    //         // }
    //         //console.log("qui", esito.data.accesso_pagina);
    //         if (esito.data.access_page.check == 1) {
    //           return true;
    //         } else {
    //           router.navigate(['deniedAccess']);
    //           return false;
    //         }
    //       } else {
    //         router.navigate(['deniedAccess']);
    //         return false;
    //       }
    //     });
  } else {
    return of(router.createUrlTree(['login']));
    // router.navigate(['login']);
    // return false;
  }
};
