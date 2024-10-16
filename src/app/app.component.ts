import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FooterComponent } from "./pages/footer/footer.component";
import { Store } from '@ngrx/store';
import { loadCountries } from './ngrx/country/country.actions';

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
export class AppComponent implements OnInit {
  title = 'WeCareWeb';
  isLogged: boolean = false;
  readonly store = inject(Store);
  constructor(public authService: AuthService) { }

  ngOnInit() {
    console.log('CountryEffects APP')
    this.store.dispatch(loadCountries());  // Dispatch per caricare i dati solo se necessario
  }
}
