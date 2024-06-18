import { Component, HostListener } from '@angular/core';
import { CurrentPageService } from '../../services/current-page.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

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
export class NavbarComponent {

  isToggle: boolean = false;
  currentPage: string = '';

  constructor(private currentPageService: CurrentPageService,
    private viewportRuler: ViewportRuler, private authService: AuthService) {

      this.currentPageService.currentUrl$.subscribe(url => {
      this.currentPage = "/" + url.split('/')[1];
    });
    this.checkWindowSize();
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
