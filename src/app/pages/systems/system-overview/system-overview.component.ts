import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadSystemsService } from '../../../services/load-systems.service';
import { SystemInfo } from '../interfaces/system-info';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IncompleteDialogComponent } from '../components/incomplete-dialog/incomplete-dialog.component';

@Component({
  selector: 'app-system-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltip,
    MatDialogModule,
  ],
  templateUrl: './system-overview.component.html',
  styleUrl: './system-overview.component.scss'
})
export class SystemOverviewComponent {

  warrantyExtensionStatus: string = 'Not Requested';
  isWarrantyRequest: boolean = false;
  isChat: boolean = false;
  isRma: boolean = false;

  systemName: string = '';
  system: SystemInfo;

  constructor(private loadSystemService: LoadSystemsService, private route: ActivatedRoute,
    public dialog: MatDialog, private router: Router) {
    this.route.params.subscribe(params => {
      this.systemName = params['name'];
    });
    this.system = loadSystemService.getSystem(this.systemName);
  }

  openDialog(): void {
    if (this.system.status === 'Incomplete') {
      this.dialog.open(IncompleteDialogComponent, {
        width: '250px'
      });
    }
  }

  modifySystem(name: string) {
    this.router.navigate(['/sy'])
  }


}
