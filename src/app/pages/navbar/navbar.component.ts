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
import { map, Observable } from 'rxjs';
import { PermissionsUser } from '../../interfaces/permissions-user';
import { User } from '../profile/interfaces/user';
import { Menu } from '../../interfaces/menu';
import { LanguageComponent } from "../../components/language/language.component";
import { IpInfoConnectService } from '../../services/ip-info-connect.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LanguageComponent
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isToggle: boolean = false;
  currentPage: string = '';
  userInfo$!: Observable<User | null>;
  nickname$!: Observable<string>;
  menuNavbar$!: Observable<Menu[]>;
  constructor(private currentPageService: CurrentPageService,
    private viewportRuler: ViewportRuler, private authService: AuthService,
    private store: Store<{ user: UserState }>,
  private ipInfoConnectService: IpInfoConnectService) {

    this.currentPageService.currentUrl$.subscribe(url => {
      this.currentPage = "/" + url.split('/')[1];
    });
    this.checkWindowSize();
    // si richiama al server
    this.store.dispatch(UserActions.loadUserInfo());
    this.store.dispatch(UserActions.loadUserPermissions());

    // si ottiene i risultati
    this.nickname$ = store.select(state => state.user.userInfo).pipe(
      map((user) => user ? user?.nickname : 'Profile')
    );

    this.menuNavbar$ = store.select(state => state.user.permissions).pipe(
      map((val) => val ? val.menu : []),
      map((menus: Menu[]) => menus.filter(menu => menu.level === 0))
    )

  }

  ngOnInit(): void {

  }

  isCurrentPage(src: string | null): boolean {
    if(src){
      return (this.currentPage.toLowerCase().includes(src.toLowerCase()));
    }else{
      return false;
    }

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
