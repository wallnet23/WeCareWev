import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Device } from '../interfaces/device';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { ActivatedRoute } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SystemStatus } from '../../systems/interfaces/system-status';
import { TranslateModule } from '@ngx-translate/core';
import { UserState } from '../../../ngrx/user/user.reducer';
import { Store } from '@ngrx/store';

interface InverterWarranty {
  serialnumber: string;
  warranty_expirationdefault: string;
  warranty_expirationextended: string;
};

interface BatteryWarranty {
  serialnumber: string;
  warranty_expirationdefault: string;
  warranty_expirationextended: string;
}

@Component({
  selector: 'app-warranty-info',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './warranty-info.component.html',
  styleUrl: './warranty-info.component.scss'
})
export class WarrantyInfoComponent {

  idsystem: number = 0;
  currentLanguage = 'en';
  inverterList: InverterWarranty[] = [];
  installer_dateofpurchase: string = '';
  batteriesList: BatteryWarranty[] = [];
  systemStatus: SystemStatus | null = null;

  constructor(private connectServerService: ConnectServerService,
    private route: ActivatedRoute, private store: Store<{ user: UserState
     }>) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      this.getDevices();
      this.store.select(state => state.user.userInfo).subscribe(
        (val) => {
          this.currentLanguage = val?.lang_code ? val?.lang_code : 'en';
        }
      )
    });
  }

  private getDevices() {
    this.connectServerService.getRequest<ApiResponse<{inverterList: InverterWarranty[],
      batteriesList: BatteryWarranty[], systemStatus: SystemStatus, installer_dateofpurchase: string}>>
    (Connect.urlServerLaraApi, 'system/infoWarrantySystem', {idsystem: this.idsystem})
    .subscribe((val: ApiResponse<{inverterList: InverterWarranty[], batteriesList: BatteryWarranty[], systemStatus: SystemStatus,
      installer_dateofpurchase: string
    }>) => {
      if(val.data) {
        this.inverterList = val.data.inverterList;
        this.batteriesList = val.data.batteriesList;
        this.systemStatus = val.data.systemStatus;
        this.installer_dateofpurchase = val.data.installer_dateofpurchase;
      }
    })
  }

}
