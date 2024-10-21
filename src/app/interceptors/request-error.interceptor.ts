import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ConnectServerService } from '../services/connect-server.service';
import { inject } from '@angular/core';
import { catchError, throwError, timeout } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PopupDialogService } from '../services/popup-dialog.service';

export const requestErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const connectServerService = inject(ConnectServerService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const popupDialogService = inject(PopupDialogService);

  // Variabili per tracciare l'ultimo errore e l'ultimo tempo del popup
  let lastErrorMessage: string | null = null;
  let lastErrorTimestamp: number | null = null;
  const popupDelay = 5000; // Intervallo di tempo minimo tra i popup (in millisecondi)

  return next(req).pipe(
    timeout({ each: connectServerService.getTimeoutForRequest(req), with: () => throwError(() => new Error('Timeout della richiesta')) }),
    catchError((error: HttpErrorResponse | any) => {
      // Default error message
      let errorMessage = 'An unknown error occurred';
      let code = 544;
      let not_popup = 0; // se 1 non voglio il popup
      let alert_type = null;
      let obj_dialog = null;
      let obj_toast = null;

      // Handle client-side errors
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client-side error: ${error.error.message}`;
        alert_type = 1;
      } else {
        // Handle server-side errors
        errorMessage = `Server-side error: ${error.status} - ${error.message}`;
        switch (error.status) {
          case 400:
            // Bad Request
            errorMessage = `Bad Request: ${error.error.message || error.message}`;
            code = 400;
            break;
          case 401:
            // Unauthorized
            errorMessage = 'Unauthorized access. Please log in.';
            // vai al login ma anche cancella token
            authService.removeLocalAuth();
            router.navigate(['/login']);
            // not_popup = 1;
            alert_type = 1;
            code = 401;
            break;
          case 403:
            // Forbidden
            errorMessage = 'You do not have permission to perform this action.';
            code = 403;
            break;
          case 404:
            // Not Found
            errorMessage = 'The requested resource was not found.';
            code = 404;
            break;
          case 500:
            // Internal Server Error
            errorMessage = 'An internal server error occurred. Please try again later.';
            code = 500;
            break;
          default:
            // Other errors
            errorMessage = `Generic error! If it persists, contact the supplier.`;
            code = error.status;
            if ((error.error && error.error.type_alert) || error.type_alert) {
              alert_type = error.error.type_alert || error.type_alert;
            }
          // console.log(`Unexpected error: ${error.message}`);
        }
        if ((error.error && error.error.message) || error.message) {
          errorMessage = `${error.error.message || error.message}`;
          // console.log('error info: ',error)
        }
        if ((error.error && error.error.obj_dialog) || error.obj_dialog) {
          obj_dialog = error.error.obj_dialog || error.obj_dialog;
        }
        if ((error.error && error.error.obj_toast) || error.obj_toast) {
          obj_toast = error.error.obj_toast || error.obj_toast;
        }
        // console.log('error.obj_dialog', error.error);
      }

      // Log the error to the console
      // console.error(errorMessage);
      const currentTime = Date.now();
      const obj_request: ApiResponse<any> = {
        code: code,
        data: {},
        title: 'Error',
        message: errorMessage,
        type_alert: alert_type,
        obj_dialog: obj_dialog,
        obj_toast: obj_toast
      }
      // if (not_popup == 0) {
      //   popupDialogService.alertElement(obj_request);
      // }
      // Controlla se l'errore è uguale all'ultimo errore mostrato e se è passato poco tempo
      if (not_popup == 0 && (!lastErrorMessage || lastErrorMessage !== errorMessage || (lastErrorTimestamp && currentTime - lastErrorTimestamp > popupDelay))) {
        popupDialogService.alertElement(obj_request);
        lastErrorMessage = errorMessage;
        lastErrorTimestamp = currentTime;
      }

      // Return an observable with a user-facing error message
      return throwError(() => new Error(errorMessage));
    })
  );
  // return next(req);
};
