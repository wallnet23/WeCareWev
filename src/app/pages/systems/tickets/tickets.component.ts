import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../interfaces/ticket';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent {

  tickets: Ticket[] = []

  constructor(private ticketService: TicketService) {
    this.tickets = ticketService.tickets;
  }

}
