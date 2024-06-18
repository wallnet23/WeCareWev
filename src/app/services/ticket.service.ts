import { Injectable } from '@angular/core';
import { Ticket } from '../pages/systems/interfaces/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  tickets: Ticket[] = []

  constructor() { 

    this.tickets = [
      {id: 0, name: "Ticket 1", date: "20/11/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", system: null, status: "Waiting"},
      {id: 1, name: "Ticket 2", date: "10/05/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", system: "MySystem", status: "Completed"},
      {id: 2, name: "Ticket 3", date: "20/11/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", system: null, status: "Waiting"},
      {id: 3, name: "Ticket 4", date: "10/05/23", description: "Breve descrizione sistema con eventuale ellispsis se troppo lunga per la colonna", system: "MySystem", status: "Working"},
    ]
  }
}
