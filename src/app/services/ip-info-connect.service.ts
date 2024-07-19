import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Connect } from '../classes/connect';
import { catchError, map, Observable, of } from 'rxjs';
import { ConnectServerService } from './connect-server.service';
import { Store } from '@ngrx/store';
import { UserState } from '../ngrx/user/user.reducer';
import { User } from '../pages/profile/interfaces/user';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../interfaces/api-response';
import * as UserActions from '../ngrx/user/user.actions';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IpInfoConnectService {

  languagesList: {
    code: string;
    name: string;
    sign: string;
    flag: string;
  }[] = [
      { code: 'en', sign: 'EN', name: 'English', flag: 'en.png' },
      { code: 'it', sign: 'IT', name: 'Italian', flag: 'it.png' },
    ];

  apiUrl = `${Connect.IPINFO_URL}?token=${Connect.IPINFO_API_TOKEN}`;
  constructor(private connectServerService: ConnectServerService,
    private store: Store<{ user: UserState }>, private translateService: TranslateService,
    private authService: AuthService) { }

  getLanguage(): Observable<string> {
    return this.connectServerService.getRequest(this.apiUrl, '', {}).pipe(
      map((response: any) => {
        // Estrarre la lingua preferita dal servizio di geolocalizzazione
        const language = response.country.toLowerCase(); // Esempio: utilizzare il paese come lingua
        // console.log(response);
        return language;
      }),
      catchError((error) => {
        // console.error('Error getting location:', error);
        return of('en'); // Fallback a una lingua predefinita in caso di errore
      })
    );
  }

  /**
   * Setta la linga nell'app
   */
  setUserLanguageApp() {
    if(this.authService.isLoggedIn()){
      this.store.select(state => state.user.userInfo).subscribe(
        (val: User | null) => {
          if (val) {
            if (val.lang_code) {
              this.translateService.setDefaultLang(val.lang_code);
            } else {
              this.getLanguage().subscribe(
                (lang: string) => {
                  this.translateService.setDefaultLang(lang);
                }
              )
            }
          }

        }
      );
    }else{
      this.getLanguage().subscribe(
        (lang: string) => {
          this.translateService.setDefaultLang(lang);
        }
      )
    }

  }

  setUserLanguageDb(code_lang: string) {
    if (code_lang.length > 0 && this.checkIfCodeExists(code_lang)) {
      if (this.authService.isLoggedIn()) {
        this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'user/updateLanguage',
          {
            code: code_lang
          }).subscribe(
            (val) => {
              this.store.dispatch(UserActions.loadUserInfo());
              this.setUserLanguageApp();
            }
          )
      } else {
        this.translateService.setDefaultLang(code_lang);
      }
    }
  }

  private checkIfCodeExists(code_flag: string): boolean {
    return this.languagesList.some(language => language.code === code_flag);
  }
}
