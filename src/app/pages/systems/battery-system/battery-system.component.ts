import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SystemCardComponent } from '../components/system-card/system-card.component';
import { LoadSystemsService } from '../../../services/load-systems.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-battery-system',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SystemCardComponent,
    FormsModule
  ],
  templateUrl: './battery-system.component.html',
  styleUrl: './battery-system.component.scss'
})
export class BatterySystemComponent {
searchText: any;

  constructor(private router: Router, public loadSystemService: LoadSystemsService) {}

  navigate(src: string) {
    this.router.navigate([src]);
  }
}
