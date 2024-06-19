import { Injectable } from '@angular/core';
import { Ticket } from '../pages/systems/interfaces/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  tickets: Ticket[] = []

  constructor() { 

    this.tickets = [
      {id: 0, title: "Ticket 1", date_ticket: "20/11/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", idsystem: null, status: "Waiting"},
      {id: 1, title: "Ticket 2", date_ticket: "10/05/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", idsystem: 1, status: "Completed"},
      {id: 2, title: "Ticket 3", date_ticket: "20/11/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", idsystem: null, status: "Waiting"},
      {id: 3, title: "Ticket 4", date_ticket: "10/05/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", idsystem: 2, status: "Working"},
    ]
  }
}
