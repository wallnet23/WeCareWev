import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadSystemsService } from '../../../services/load-systems.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssistanceRequestsService } from '../../../services/assistance-requests.service';
import { Warranty } from '../interfaces/warranty';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { SystemInfo } from '../interfaces/system-info';
import { Ticket } from '../interfaces/ticket';
import { RMA } from '../interfaces/rma';

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
  isTicket: boolean = false;
  isRma: boolean = false;

  idsystem: number = 0;
  systemInfo!: SystemInfo | null;
  systemTickets: Ticket[] = [];
  systemWarranty!: Warranty;
  systemRMA!: RMA;

  constructor(private loadSystemService: LoadSystemsService, private route: ActivatedRoute,
    public dialog: MatDialog, private router: Router, private assistanceRequestsService: AssistanceRequestsService,
    private connectServerService: ConnectServerService) {

    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
    });

    this.getSystemOverview();
  }

  getSystemOverview() {
    this.connectServerService.getRequest<ApiResponse<{systemInfo: SystemInfo, systemTickets: Ticket[], systemWarranty: Warranty, systemRMA: RMA}>>
    (Connect.urlServerLaraApi, 'system/systemOverview', {id: this.idsystem})
    .subscribe((val: ApiResponse<{systemInfo: SystemInfo, systemTickets: Ticket[], systemWarranty: Warranty, systemRMA: RMA}>) => {
      if(val.data) {
        this.systemInfo = val.data.systemInfo;
        this.systemTickets = val.data.systemTickets;
        this.systemWarranty = val.data.systemWarranty;
        this.systemRMA = val.data.systemRMA;
        if(this.systemTickets.length > 0) {
          this.isTicket = true;
        }
      }
    })
  }

  modifyDescription(description: string) {
    console.log(description);
    this.connectServerService.postRequest<ApiResponse<{}>>(Connect.urlServerLaraApi, '', {description: description})
    .subscribe((val: ApiResponse<{}>) => {
      if(val.data) {
        this.systemInfo!.description = description;
        console.log("changed");
      }
    })
  }

  ticketsListSystem() {
    this.router.navigate(['/systemTicketsList', 1]);
  }
  newTicket() {
    this.router.navigate(['/newTicket', this.idsystem]);
  }

  goToTicket(id: number) {
    this.router.navigate(['/modifyTicket', id])
  }

  modifySystem() {
    this.router.navigate(['/systemModify', this.idsystem])
  }

  warrantyExtension() {
    this.router.navigate(['/warrantyExtension'])
  }

  // goTo(request: AssistanceRequest) {
  //   this.router.navigate(['/assistanceRequest', request])
  // }

}
