import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SystemCardComponent } from '../components/system-card/system-card.component';
import { LoadSystemsService } from '../../../services/load-systems.service';
import { FormsModule } from '@angular/forms';
import { SystemInfo } from '../interfaces/system-info';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';

@Component({
  selector: 'app-systems-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SystemCardComponent,
    FormsModule
  ],
  templateUrl: './systems-list.component.html',
  styleUrl: './systems-list.component.scss'
})
export class SystemsListComponent {
searchText: any;

  systemsList: SystemInfo[] = [] 

  constructor(private router: Router, public loadSystemService: LoadSystemsService,
    private connectServerService: ConnectServerService) {

    }

  navigate(src: string) {
    this.router.navigate([src]);
  }
}
