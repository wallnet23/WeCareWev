import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadSystemsService } from '../../../services/load-systems.service';
import { SystemInfo } from '../interfaces/full-system-interface';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IncompleteDialogComponent } from '../components/incomplete-dialog/incomplete-dialog.component';
import { AssistanceRequestsService } from '../../../services/assistance-requests.service';
import { AssistanceRequest } from '../interfaces/assistance-request';

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

  requests: AssistanceRequest[] = [];
  latestRequests: AssistanceRequest[] = [];
  warrantyExtensionStatus: string = 'Not Requested';
  isWarrantyRequest: boolean = false;
  isChat: boolean = false;
  isRma: boolean = false;

  systemName: string = '';
  system: SystemInfo;

  constructor(private loadSystemService: LoadSystemsService, private route: ActivatedRoute,
    public dialog: MatDialog, private router: Router, private assistanceRequestsService: AssistanceRequestsService) {
    this.route.params.subscribe(params => {
      this.systemName = params['name'];
    });
    this.system = loadSystemService.getSystem(this.systemName);
    this.latestRequests = assistanceRequestsService.latestRequests;
    this.requests = assistanceRequestsService.requests;
    if(this.latestRequests.length > 0) {
      this.isChat = true;
    }
  }

  openDialog(): void {
    if (this.system.status === 'Incomplete') {
      this.dialog.open(IncompleteDialogComponent, {
        width: '250px'
      });
    }
  }

  openDialogOrGoTo(src: string): void {
    if(this.system.status === 'Incomplete') {
      this.dialog.open(IncompleteDialogComponent, {
        width: '250px'
      });
    }
    else {
      this.router.navigate([src])
    }
  }  

  modifySystem() {
    this.router.navigate(['/newSystem', this.systemName])
  }

  goTo(request: AssistanceRequest) {
    this.router.navigate(['/assistanceRequest', request])
  }

}
