import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Warranty } from '../interfaces/warranty';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { SystemInfo } from '../interfaces/system-info';
import { Ticket } from '../../tickets/interfaces/ticket';
import { RMA } from '../interfaces/rma';
import { PopupDialogService } from '../../../services/popup-dialog.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-system-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltip,
    MatDialogModule,
    TranslateModule
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
  // systemTickets: Ticket[] = [];
  systemWarranty!: Warranty;
  systemRMA!: RMA;

  constructor(private popupDialogService: PopupDialogService, private route: ActivatedRoute,
    public dialog: MatDialog, private router: Router,
    private connectServerService: ConnectServerService, private location: Location) {

    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
    });

    this.getSystemOverview();
  }

  getSystemOverview() {
    this.connectServerService.getRequest<ApiResponse<{systemInfo: SystemInfo, systemWarranty: Warranty, systemRMA: RMA}>>
    (Connect.urlServerLaraApi, 'system/systemOverview', {id: this.idsystem})
    .subscribe((val: ApiResponse<{systemInfo: SystemInfo,  systemWarranty: Warranty, systemRMA: RMA}>) => {
      if(val.data) {
        this.systemInfo = val.data.systemInfo;
        // this.systemTickets = val.data.systemTickets;
        this.systemWarranty = val.data.systemWarranty;
        this.systemRMA = val.data.systemRMA;
        // if(this.systemTickets.length > 0) {
        //   this.isTicket = true;
        // }
        // console.log("System info:", this.systemInfo)
      }
    })
  }

  modifyDescription(description: string) {
    // console.log(description);
    this.connectServerService.postRequest<ApiResponse<{system_description: string}>>
    (Connect.urlServerLaraApi, 'system/systemModifyDescription', {idsystem: this.idsystem, system_description: description})
    .subscribe((val: ApiResponse<{system_description: string}>) => {
      this.popupDialogService.alertElement(val);
      if(val.data) {
        this.systemInfo!.system_description = val.data.system_description;
      }
    })
  }

  // ticketsListSystem() {
  //   this.router.navigate(['/systemTicketsList', 1]);
  // }
  // newTicket() {
  //   this.router.navigate(['/newTicket', this.idsystem]);
  // }

  // goToTicket(id: number) {
  //   this.router.navigate(['/modifyTicket', id]);
  // }

  modifySystem() {
    this.router.navigate(['/systemManagement', this.idsystem]);
  }

  viewSystem() {
    this.router.navigate(['/systemReadonly', this.idsystem]);
  }

  warrantyInfo() {
    const obj_request: ApiResponse<any> = {
      code: 244,
      data: {},
      title: 'Info',
      message: 'Works in progress. Feature to be implemented!',
      obj_dialog: {
        disableClose: 0
      }
    }
    this.popupDialogService.alertElement(obj_request);
    // this.router.navigate(['/warrantyInfo', this.idsystem]);
  }

  goBack() {
    this.location.back();
  }

  // goTo(request: AssistanceRequest) {
  //   this.router.navigate(['/assistanceRequest', request])
  // }

}
