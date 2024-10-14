import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { selectUserLangCode } from '../ngrx/user/user.selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const store = inject(Store);
  // Ottieni lang_code come Observable dallo store NgRx
  return store.select(selectUserLangCode).pipe(
    switchMap((currentLanguage: string) => {
      const newReq = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${authService.getToken()}`,
          'Accept-Language': currentLanguage || 'en', // Usa 'en' come fallback
        },
      });
      return next(newReq); // Continua la catena di richieste
    })
  );

  // const newReq = req.clone({
  //   setHeaders: {
  //     Accept: 'application/json',
  //     Authorization: `Bearer ${authService.getToken()}`,
  //     'Accept-Language': currentLanguage,
  //   },
  // });
  // //console.log('headers:', req.headers);
  // return next(newReq);
};
