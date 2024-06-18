import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, Subject, tap } from 'rxjs';
import { ConnectServerService } from './connect-server.service';
import { Connect } from '../classes/constants'
import { Router } from '@angular/router';
import { User } from '../pages/profile/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new Subject<User | null>();
  getInfoUserLogged(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  private menuSubject = new Subject<string>();
  getInfoMenu(): Observable<string> {
    // console.log('ricevi menu');
    return this.menuSubject.asObservable();
  }
  setInfoMenu() {
    // console.log('invia menu');
    this.menuSubject.next('load');
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

  async loginUser(email_value: string, password_value: string) {
    const esito = await lastValueFrom(
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'login', {
        email: email_value,
        password: password_value,
      })
    );
    // console.log('esito', esito);
    if (esito && esito.access_token) {
      this.setToken(esito.access_token);
      this.setLoginIn('ok');
      this.getUser();
      this.setInfoMenu();
      //this.urlService.setInfoCurrenPage('home');
      // console.log('Token:', this.getToken());
    }
  }

  logoutUser() {
    return this.connectServerService.postRequest(Connect.urlServerLaraApi, `logout`, {}).subscribe(
      (esito: any) => {
        // console.log('logout', esito);
        this.removeLocalAuth();
        this.userSubject.next(null);
        this.setInfoMenu();
        //this.urlService.setInfoCurrenPage('home');
        this.router.navigate(['home']);
      }
    );
  }

  getUser() {
    return this.connectServerService.getRequest<User>(Connect.urlServerLaraApi, 'user', {}).subscribe(
      (val: User) => {
        console.log('Response: ', val);
        if (this.isLoggedIn()) {
          // this.user$ = this.userSubject.asObservable();
          this.userSubject.next(val);
        } else {
          // this.user$ = this.userSubject.asObservable();
          this.userSubject.next(null);
        }
      });
  }

  getToken(): string | null {
    if (localStorage) {
      return localStorage.getItem('token') ? localStorage.getItem('token') : null;
    } else {
      return null;
    }
  }

  setToken(val: string) {
    localStorage.setItem('token', val);
  }

  private setLoginIn(val: string) {
    localStorage.setItem('logAuthW', val);
  }

  private removeLoginIn() {
    localStorage.removeItem('logAuthW');
  }

  private removeToken() {
    localStorage.removeItem('token');
  }
  public removeLocalAuth() {
    this.removeLoginIn();
    this.removeToken();
  }
}