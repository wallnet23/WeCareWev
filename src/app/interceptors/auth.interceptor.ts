import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { selectUserLangCode } from '../ngrx/user/user.selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const store = inject(Store);

  if (req.url.includes('/user/login')) {
    const newReq = req.clone({
      setHeaders: {
        Accept: 'application/json',
        // Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return next(newReq);
  }
  // Ottieni lang_code come Observable dallo store NgRx
  return store.select(selectUserLangCode).pipe(
    switchMap((currentLanguage: string | null) => {
      const language = currentLanguage || 'en'; // Fallback se currentLanguage è null o undefined
      const newReq = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${authService.getToken()}`,
          'Accept-Language': language, // Usa 'en' come fallback
        },
      });
      return next(newReq); // Continua la catena di richieste
    })
  );


};
