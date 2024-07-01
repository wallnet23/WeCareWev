import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SystemCardComponent } from '../components/system-card/system-card.component';
import { FormsModule } from '@angular/forms';
import { SystemInfo } from '../interfaces/system-info';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-systems-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SystemCardComponent,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './systems-list.component.html',
  styleUrl: './systems-list.component.scss'
})
export class SystemsListComponent {
searchText: any;

  systemsList: SystemInfo[] = []

  constructor(private router: Router) {

    }

  navigate(src: string) {
    this.router.navigate([src]);
  }
}
