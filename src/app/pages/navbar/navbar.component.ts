import { Component, HostListener, OnInit } from '@angular/core';
import { CurrentPageService } from '../../services/current-page.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../ngrx/user/user.reducer';
import * as UserActions from '../../ngrx/user/user.actions';
import { Observable } from 'rxjs';
import { PermissionsUser } from '../../interfaces/permissions-user';
import { User } from '../profile/interfaces/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  isToggle: boolean = false;
  currentPage: string = '';
  userInfo$!: Observable<User | null>;
  userPermissions$!: Observable<PermissionsUser | null>;

  constructor(private currentPageService: CurrentPageService,
    private viewportRuler: ViewportRuler, private authService: AuthService,
    private store: Store<{ user: UserState }>) {

      this.currentPageService.currentUrl$.subscribe(url => {
      this.currentPage = "/" + url.split('/')[1];
    });
    this.checkWindowSize();
    // si richiama al server
    this.store.dispatch(UserActions.loadUserInfo());
    this.store.dispatch(UserActions.loadUserPermissions());

    // si ottiene i risultati
    store.select(state => state.user.userInfo).subscribe(
      (val) => {
console.log('navbar:',val);
      }
    )
     store.select(state => state.user.permissions).subscribe(
      (val) => {
console.log('navbar menu:',val);
      }
    )
  }


ngOnInit(): void {

}

  isCurrentPage(src: string): boolean {
    return (this.currentPage.toLowerCase().includes(src.toLowerCase()));
  }

  logout() {
    //Esegui il logout
    this.authService.logoutUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize()
  }

  checkWindowSize(): boolean {
    const screenWidth = this.viewportRuler.getViewportSize().width;
    return this.isToggle = screenWidth < 992;
  }
}
