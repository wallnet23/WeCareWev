import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { CurrentPageService } from './services/current-page.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FooterComponent } from "./pages/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    NgxSpinnerModule,
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WeCareWeb';
  isLogged: boolean = false;

  constructor(private currentPageService: CurrentPageService, public authService: AuthService) { }


}
