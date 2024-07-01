import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

let count_spinner = 0;
export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  spinner.show(undefined, {
    fullScreen: true,
    type: 'square-jelly-box', // 'pacman'
    bdColor: 'rgba(0,0,0,0.4)',
    size: 'default'
  });
  count_spinner++;
  return next(req).pipe(
    finalize(
      () => {
        count_spinner--;
        if (count_spinner === 0) {
          spinner.hide();
        }
      }
    )
  );
};
