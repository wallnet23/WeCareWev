import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoadSystemsService } from '../../../../services/load-systems.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SystemInfo } from '../../interfaces/system-info';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { ApiResponse, ObjButtonPopup } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { TranslateModule } from '@ngx-translate/core';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-system-card',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    TranslateModule,
    MatTooltipModule,
  ],
  templateUrl: './system-card.component.html',
  styleUrl: './system-card.component.scss'
})
export class SystemCardComponent {

  isSystem: boolean = false;
  systemsList: SystemInfo[] = [];

  constructor(private router: Router, private popupDialogService: PopupDialogService,
    private connectServerService: ConnectServerService) {
    this.getSystemList()
  }

  getSystemList() {
    this.connectServerService.getRequest<ApiResponse<{ systemsInfo: SystemInfo[] }>>
      (Connect.urlServerLaraApi, 'system/systemsList', {})
      .subscribe((val: ApiResponse<{ systemsInfo: SystemInfo[] }>) => {
        if (val.data) {
          this.systemsList = val.data.systemsInfo;
          if (this.systemsList.length > 0) {
            this.isSystem = true;
          }
        }
      })
  }

  systemOverview(id: number) {
    this.router.navigate(['/systemOverview', id]);
  }

  deleteSystem(id: number) {
    const obj_request: ApiResponse<any> = {
      code: 240,
      data: {},
      title: 'Warning',
      message: 'Sei sicuro di voler cancellare l\'impianto? Azione irreversibile.',
      obj_dialog: {
        disableClose: 1,
        obj_buttonAction:
        {
          action: 1,
          action_type: 2,
          label: 'Delete',
          run_function: (val?: number) => this.actionDeleteSystem(id)
        }
      }
    }
    this.popupDialogService.alertElement(obj_request);
  }

  private actionDeleteSystem(id: number): void {
    this.connectServerService.postRequest<ApiResponse<any>>(
      Connect.urlServerLaraApi, 'system/systemDelete', { idsystem: id })
      .subscribe((val: ApiResponse<any>) => {
        this.getSystemList();
      })
  }

}
