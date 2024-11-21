import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

let count_spinner = 0;
export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  // Controlla se l'intestazione per disabilitare lo spinner è presente
  const disableSpinner = req.headers.get('X-Disable-Spinner') === 'true';
  if (!disableSpinner) {
    spinner.show(undefined, {
      fullScreen: true,
      type: 'square-jelly-box', // 'pacman'
      bdColor: 'rgba(0,0,0,0.4)',
      size: 'default'
    });
    count_spinner++;
  }
  return next(req).pipe(
    finalize(
      () => {
        if (!disableSpinner) {
          count_spinner--;
        }
        if (count_spinner === 0) {
          spinner.hide();
        }
      }
    )
  );
};
