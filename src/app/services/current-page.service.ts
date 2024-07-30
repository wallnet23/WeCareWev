import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentPageService {

  previousUrl: string = '';

  private currentUrlSubject = new BehaviorSubject<string>('/');
  currentUrl$ = this.currentUrlSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: any): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.url;
      this.currentUrlSubject.next(currentUrl);
    });
  }

  handleNavigation(url: string) {
    this.previousUrl = url;
  }
}
