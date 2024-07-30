import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { CommonModule } from '@angular/common';
import { Ticket } from '../interfaces/ticket';
import { SystemInfo } from '../../systems/interfaces/system-info';


@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {

  id: string | null = null;
  ticket: Ticket | null = null;
  system: SystemInfo | null = null;

  constructor( private activatedRoute: ActivatedRoute,
    private router: Router, private connectServerService: ConnectServerService) {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      console.log('ID:', this.id);
    });
    if(this.id) {
      this.getTicketAndSystemFromServer();
    } else {
      router.navigate(['/ticketsList']);
    }
  }

  private getTicketAndSystemFromServer() {
    this.connectServerService.getRequest<ApiResponse<{ticket: Ticket, system: SystemInfo}>>(Connect.urlServerLaraApi, 'ticket/infoTicket', {id: this.id}).
    subscribe((val: ApiResponse<{ticket: Ticket, system: SystemInfo}>) => {
      if(val.data && val.data.ticket) {
        this.ticket = val.data.ticket;
        if(val.data.system) {
          this.system = val.data.system;
        }
      }
    })
  }

}
