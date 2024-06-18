import { HttpInterceptorFn } from '@angular/common/http';

export const requestErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
