import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, Subject, tap } from 'rxjs';
import { ConnectServerService } from './connect-server.service';
import { Connect } from '../classes/connect'
import { Router } from '@angular/router';
import { User } from '../pages/profile/interfaces/user';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new Subject<User | null>();
  getInfoUserLogged(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  authorization: string = 'none';

  constructor(private connectServerService: ConnectServerService, private router: Router) {
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('loggedW') && localStorage.getItem('loggedW') == 'ok') {
      return true;
    }
    return false;
  }

  registerUser(n: string, e: string, p: string) {
    return this.connectServerService.postRequest(Connect.urlServerLaraApi, `register`, {
      name: n,
      email: e,
      password: p,
    });
  }

  loginUser(email_value: string, password_value: string) {
    // Assicurati che questo ritorni un Observable
    return this.connectServerService
      .postRequest<ApiResponse<{ authorization: { token: string; type: string; } }>>(
        Connect.urlServerLaraApi,
        'user/login', 
        {
          email: email_value,
          password: password_value,
        }
      )
      .pipe(
        tap((esito) => {
          console.log('esito', esito);
          this.setToken(esito.data.authorization.token);
          this.setLoginIn('ok');
        })
      );
  }

  // async loginUser(email_value: string, password_value: string) {

  //   this.connectServerService.postRequest<ApiResponse<{ authorization: { token: string; type: string; } }>>(Connect.urlServerLaraApi, 'user/login', {
  //     email: email_value,
  //     password: password_value,
  //   }).subscribe((esito) => {
  //     console.log('esito', esito);
  //     this.setToken(esito.data.authorization.token);
  //     this.setLoginIn('ok');
  //   })

  //   // console.log('esito', esito);
  //   // if (esito && esito.data && esito.data.authorization) {
  //   //   this.setToken(esito.data.authorization.token);
  //   //   this.setLoginIn('ok');
  //   // }
  // }

  logoutUser() {
    return this.connectServerService.postRequest(Connect.urlServerLaraApi, `user/logout`, {}).subscribe(
      (esito: any) => {
        // console.log('logout', esito);
        this.removeLocalAuth();
        this.userSubject.next(null);
        //this.urlService.setInfoCurrenPage('home');
        this.router.navigate(['login']);
      }
    );
  }

  // getUser() {
  //   return this.connectServerService.getRequest<User>(Connect.urlServerLaraApi, 'user/user', {}).subscribe(
  //     (val: User) => {
  //       console.log('Response: ', val);
  //       if (this.isLoggedIn()) {
  //         // this.user$ = this.userSubject.asObservable();
  //         this.userSubject.next(val);
  //       } else {
  //         // this.user$ = this.userSubject.asObservable();
  //         this.userSubject.next(null);
  //       }
  //     });
  // }

  getToken(): string | null {
    if (localStorage) {
      // let prova = localStorage.getItem('XSFR-TOKEN') ? localStorage.getItem('XSFR-TOKEN') : null
      // console.log(prova)
      return localStorage.getItem('token') ? localStorage.getItem('token') : null;
    } else {
      return null;
    }
  }

  setToken(val: string) {
    localStorage.setItem('token', val);
  }

  private setLoginIn(val: string) {
    localStorage.setItem('loggedW', val);
  }

  private removeLoginIn() {
    localStorage.removeItem('loggedW');
  }

  private removeToken() {
    localStorage.removeItem('token');
  }
  public removeLocalAuth() {
    this.removeLoginIn();
    this.removeToken();
  }
}
