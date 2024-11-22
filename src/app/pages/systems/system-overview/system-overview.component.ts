import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { SystemInfo } from '../interfaces/system-info';
import { PopupDialogService } from '../../../services/popup-dialog.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SystemStatus } from '../interfaces/system-status';
import { Ticket } from '../../tickets/interfaces/ticket';

@Component({
  selector: 'app-system-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
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
  latestTickets: Ticket[] = [
    {
      id: 1,
      title: "Errore Sistema",
      date_ticket: "2024-11-22",
      description: "Il sistema si blocca durante l'avvio.",
      idsystem: 101,
      status: "Aperto"
    },
    {
      id: 2,
      title: "Richiesta Aggiornamento",
      date_ticket: "2024-11-20",
      description: "Richiesta di aggiornamento alla versione più recente.",
      idsystem: 102,
      status: "In corso"
    },
    {
      id: 3,
      title: "Problema di Connessione",
      date_ticket: "2024-11-18",
      description: "Impossibile connettersi al server principale.",
      idsystem: null,
      status: "Chiuso"
    }
  ];

  idsystem: number = 0;
  systemInfo!: SystemInfo | null;
  // systemTickets: Ticket[] = [];
  //1 == inverter, 2 == batterie, 3 == inverter e batterie
  product_systemweco: number | null = null;
  //systemRMA!: RMA;

  constructor(private popupDialogService: PopupDialogService, private route: ActivatedRoute,
    public dialog: MatDialog, private router: Router, private translate: TranslateService,
    private connectServerService: ConnectServerService, private location: Location) {

    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
    });

    this.getSystemOverview();
  }

  getSystemOverview() {
    this.connectServerService.getRequest<ApiResponse<{ systemInfo: SystemInfo }>>
      (Connect.urlServerLaraApi, 'system/systemOverview', { id: this.idsystem })
      .subscribe((val: ApiResponse<{
        systemInfo: SystemInfo
      }>) => {
        if (val.data) {
          this.systemInfo = val.data.systemInfo;
          // this.systemTickets = val.data.systemTickets;
          this.product_systemweco = val.data.systemInfo.product_systemweco;
          // if(this.systemTickets.length > 0) {
          //   this.isTicket = true;
          // }
          // console.log("System info:", this.systemInfo)
        }
      })
  }

  modifyDescription(description: string) {
    // console.log(description);
    this.connectServerService.postRequest<ApiResponse<{ system_description: string }>>
      (Connect.urlServerLaraApi, 'system/systemModifyDescription', { idsystem: this.idsystem, system_description: description })
      .subscribe((val: ApiResponse<{ system_description: string }>) => {
        this.popupDialogService.alertElement(val);
        if (val.data) {
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

  viewWarranty() {
    if (this.systemInfo?.status?.id == 15) {
      if (this.product_systemweco == 3) {
        this.router.navigate(['systemWarranty', this.idsystem])
      }
      else {
        this.warrantyInfo(2);
      }
    }
    else {
      this.warrantyInfo(1);
    }

  }

  warrantyInfo(type: number) {
    this.translate.get(['POPUP.TITLE.INFO', 'SYSTEM.OVERVIEW.POPUPMSG1', 'SYSTEM.OVERVIEW.POPUPMSG2']).subscribe((translations) => {
      let popupMsg = '';
      if (type == 1) {
        popupMsg = translations['SYSTEM.OVERVIEW.POPUPMSG1'];
      }
      else {
        popupMsg = translations['SYSTEM.OVERVIEW.POPUPMSG2'];
      }
      const obj_request: ApiResponse<any> = {
        code: 244,
        data: {},
        title: translations['POPUP.TITLE.INFO'],
        message: popupMsg,
        obj_dialog: {
          disableClose: 0
        }
      }
      this.popupDialogService.alertElement(obj_request);
      // this.router.navigate(['/warrantyInfo', this.idsystem]);
    });
  }

  goBack() {
    this.location.back();
  }

  // goTo(request: AssistanceRequest) {
  //   this.router.navigate(['/assistanceRequest', request])
  // }

}
