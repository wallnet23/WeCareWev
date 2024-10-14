import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { authInterceptor } from './interceptors/auth.interceptor';
import { requestErrorInterceptor } from './interceptors/request-error.interceptor';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UserEffects } from './ngrx/user/user.effects';
import { userReducer } from './ngrx/user/user.reducer';
import { countryReducer } from './ngrx/country/country.reducer';
import { CountryEffects } from './ngrx/country/country.effects';

// required for AoT
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, requestErrorInterceptor, spinnerInterceptor])),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.apiUrl },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    importProvidersFrom(TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }))
    // TranslateModule.forRoot({
    //   defaultLanguage: 'en',
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // }).providers!
    ,
    provideStore({ user: userReducer, countries: countryReducer }),
    provideEffects([UserEffects, CountryEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
