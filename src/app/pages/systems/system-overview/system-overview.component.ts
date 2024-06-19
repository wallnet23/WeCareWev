import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadSystemsService } from '../../../services/load-systems.service';
import { SystemInfo } from '../interfaces/full-system-interface';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssistanceRequestsService } from '../../../services/assistance-requests.service';
import { AssistanceRequest } from '../interfaces/assistance-request';
import { ConnectServerService } from '../../../services/connect-server.service';

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

  ticketsList: AssistanceRequest[] = [];
  latestRequests: AssistanceRequest[] = [];
  warrantyExtensionStatus: string = 'Not Requested';
  isWarrantyRequest: boolean = false;
  isChat: boolean = false;
  isRma: boolean = false;

  systemName: string = '';
  system: SystemInfo;

  constructor(private loadSystemService: LoadSystemsService, private route: ActivatedRoute,
    public dialog: MatDialog, private router: Router, private assistanceRequestsService: AssistanceRequestsService,
    private connectServerService: ConnectServerService) {
    this.route.params.subscribe(params => {
      this.systemName = params['id'];
    });
    this.system = loadSystemService.getSystem(this.systemName);
    this.latestRequests = assistanceRequestsService.latestRequests;
    this.ticketsList = assistanceRequestsService.requests;
    if (this.latestRequests.length > 0) {
      this.isChat = true;
    }
  }

  ticketsListSystem() {
    this.router.navigate(['/systemTicketsList', 1]);
  }
  newTicket() {
    this.router.navigate(['/newTicket']);
  }

  goToTicket(id: number) {
    this.router.navigate(['/modifyTicket', id])
  }

  modifySystem() {
    this.router.navigate(['/systemModify', this.systemName])
  }

  warrantyExtension() {
    this.router.navigate(['/warrantyExtension'])
  }

  // goTo(request: AssistanceRequest) {
  //   this.router.navigate(['/assistanceRequest', request])
  // }

}
