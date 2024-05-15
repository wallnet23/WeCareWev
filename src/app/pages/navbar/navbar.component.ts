import { Component, HostListener } from '@angular/core';
import { CurrentPageService } from '../../services/current-page.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isToggle: boolean = false;
  currentPage: string = '';

  constructor(private currentPageService: CurrentPageService, private router: Router, private viewportRuler: ViewportRuler) {
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
    this.router.navigate(['/login']);
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
