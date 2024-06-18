import { CanActivateFn, Router } from '@angular/router';
import { ApiResponse } from '../interfaces/api-response';
import { ConnectServerService } from '../services/connect-server.service';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UrlService } from '../services/url.service';
import { Connect } from '../classes/connect';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const urlService = inject(UrlService);
  const connectServerService = inject(ConnectServerService);
  const router = inject(Router);
  const url = urlService.getResolvedUrl(route);
  // console.log('url:', url);
  const url_withparams = urlService.getConfiguredUrl(route);
  // console.log('url_withparams:', url_withparams);

  if (authService.isLoggedIn()) {

  return connectServerService.getRequestAsync(Connect.urlServerLaraApi, 'checkPageAccess',
    {
      path: url,
      path_composer: url_withparams
    }).then(
      (esito: ApiResponse<{ accesso_pagina: number }>) => {
        // console.log('esito',esito);
        if (esito.data && esito.data.accesso_pagina) {
          // console.log('url', url);
          // if ((url == '/login' || url == 'signup') && authService.isLoggedIn()) {
          //   router.navigate(['systemsList']);
          //   return false;
          // }
          //console.log("qui", esito.data.accesso_pagina);
          if (esito.data.accesso_pagina == 1) {
            return true;
          } else {
            router.navigate(['deniedAccess']);
            return false;
          }
        } else {
          router.navigate(['deniedAccess']);
          return false;
        }
      });
    }
    else {
      router.navigate(['login']);
      return false;
    }
};
