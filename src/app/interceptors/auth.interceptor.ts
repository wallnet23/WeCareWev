import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const newReq = req.clone({
    setHeaders:{
      Accept: 'application/json',
      Authorization: `Bearer ${authService.getToken()}`
    },
  });
  //console.log('headers:', req.headers);
  return next(newReq);
};
