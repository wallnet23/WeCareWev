import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Device } from '../interfaces/device';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { ActivatedRoute } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-warranty-info',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatTooltipModule,
  ],
  templateUrl: './warranty-info.component.html',
  styleUrl: './warranty-info.component.scss'
})
export class WarrantyInfoComponent {

  idsystem: number = 0;

  devices: Device[] = [];

  constructor(private connectServerService: ConnectServerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      this.getDevices();
    });
  }

  private getDevices() {
    this.connectServerService.getRequest<ApiResponse<{warrantyDevices: Device[]}>>(Connect.urlServerLaraApi, 'infoWarrantySystem', {id: this.idsystem})
    .subscribe((val: ApiResponse<{warrantyDevices: Device[]}>) => {
      if(val.data) {
        this.devices = val.data.warrantyDevices;
      }
    })
  }

}
