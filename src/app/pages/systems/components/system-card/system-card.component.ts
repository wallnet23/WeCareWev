import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoadSystemsService } from '../../../../services/load-systems.service';
import { SystemInfo } from '../../interfaces/system-info';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-card',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './system-card.component.html',
  styleUrl: './system-card.component.scss'
})
export class SystemCardComponent {

  isSystem: boolean = false;
  systems: SystemInfo[] = [];

  constructor(private loadSystemsService: LoadSystemsService, private router: Router) {
    this.loadSystemsService.getFilteredSystems().subscribe((result) => {
      this.systems = result;
    });

    if(this.systems.length > 0) {
      this.isSystem = true;
    }
  }

  goTo(name: string) {
    this.router.navigate(['/systemOverview', name]);
  }

}
