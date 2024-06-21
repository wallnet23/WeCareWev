import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../interfaces/ticket';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tickets-list.component.html',
  styleUrl: './tickets-list.component.scss'
})
export class TicketsListComponent {

  tickets: Ticket[] = []

  constructor(private ticketService: TicketService, private router: Router,
    private connectServerService: ConnectServerService) {
    this.getTicketListFromServer();
  }

  getTicketListFromServer() {
    this.connectServerService.getRequest<ApiResponse<Ticket[]>>(Connect.urlServerLaraApi, 'ticket/listTicket', {}).
    subscribe((val: ApiResponse<{listTickets: Ticket[]}>) => {
      if(val.data) {
        this.tickets = val.data.listTickets;
        //console.log("Tickets", val.data.listTickets)
      }
    })
  }

  goTo(src: string, id: number | null) {
    if (id) {
      this.router.navigate([src, id]);
    } else {
      this.router.navigate([src]);
    }
  }

}
