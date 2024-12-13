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
import { WarrantyInverter } from '../interfaces/warranty-inverter';

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

  warrantyInverterStatusCheck: boolean = false;
  warrantyInverterStatus: WarrantyInverter[] = [];
  warrantyExtensionStatus: string = 'Not Requested';
  isWarrantyRequest: boolean = false;
  isTicket: boolean = false;
  isRma: boolean = false;
  latestTickets: Ticket[] = [
    // {
    //   id: 1,
    //   title: "Errore Sistema",
    //   date_ticket: "2024-11-22",
    //   description: "Il sistema si blocca durante l'avvio.",
    //   idsystem: 101,
    //   status: "Aperto"
    // },
    // {
    //   id: 2,
    //   title: "Richiesta Aggiornamento",
    //   date_ticket: "2024-11-20",
    //   description: "Richiesta di aggiornamento alla versione più recente.",
    //   idsystem: 102,
    //   status: "In corso"
    // },
    // {
    //   id: 3,
    //   title: "Problema di Connessione",
    //   date_ticket: "2024-11-18",
    //   description: "Impossibile connettersi al server principale.",
    //   idsystem: null,
    //   status: "Chiuso"
    // }
  ];

  idsystem: number = 0;
  systemInfo!: SystemInfo | null;
  // systemTickets: Ticket[] = [];
  //1 == inverter, 2 == batterie, 3 == inverter e batterie
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
    this.connectServerService.getRequest<ApiResponse<{ systemInfo: SystemInfo, warrantyInverterListStatus: WarrantyInverter[] }>>
      (Connect.urlServerLaraApi, 'system/systemOverview', { id: this.idsystem })
      .subscribe((val: ApiResponse<{
        systemInfo: SystemInfo,
        warrantyInverterListStatus: WarrantyInverter[]
      }>) => {
        if (val.data) {
          this.systemInfo = val.data.systemInfo;
          this.warrantyInverterStatus = val.data.warrantyInverterListStatus;
          this.checkInverterWarranty();
          // this.systemTickets = val.data.systemTickets;
          // if(this.systemTickets.length > 0) {
          //   this.isTicket = true;
          // }
          // console.log("System info:", this.systemInfo)
        }
      });
  }

  private checkInverterWarranty() {
    // CONTROLLA SE C'E' ALMENO UN INVERTER CON GARANZIA NON NULLA
    this.warrantyInverterStatusCheck = this.warrantyInverterStatus.some(inverter => {
      inverter.warranty_valid != null;
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

  modifySystem() {
    this.router.navigate(['/systemManagement', this.idsystem]);
  }

  viewSystem() {
    this.router.navigate(['/systemReadonly', this.idsystem]);
  }

  goBack() {
    this.location.back();
  }

  ticketsListSystem() {
    // this.router.navigate(['/systemTicketsList', 1]);

    let obj_val: ApiResponse<any> = {
      // 200: success, 511: warning
      code: 244,
      data: null,
      title: "Info",
      message: "Work in progress",
      // 1: toast se null o altro apre il dialog
      type_alert: null,
      obj_toast: null,
      obj_dialog: {
        disableClose: 0,
      }
    }
    this.popupDialogService.alertElement(obj_val)
    // this.router.navigate(['/systemManagement', this.idsystem]);


  }
  // newTicket() {
  //   this.router.navigate(['/newTicket', this.idsystem]);
  // }

  // goToTicket(id: number) {
  //   this.router.navigate(['/modifyTicket', id]);
  // }

  // goTo(request: AssistanceRequest) {
  //   this.router.navigate(['/assistanceRequest', request])
  // }

}
