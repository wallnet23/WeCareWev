import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../interfaces/ticket';

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

  constructor(private ticketService: TicketService) {
    this.tickets = ticketService.tickets;
  }

}
