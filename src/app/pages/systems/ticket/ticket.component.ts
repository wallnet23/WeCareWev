import { Component } from '@angular/core';
import { AssistanceRequestsService } from '../../../services/assistance-requests.service';
import { ActivatedRoute } from '@angular/router';
import { AssistanceRequest } from '../interfaces/assistance-request';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {

  id: string | null = null;
  request!: AssistanceRequest | undefined;

  constructor(private assistanceRequestService: AssistanceRequestsService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      console.log('ID:', this.id);
    });
    if(this.id) {
      this.request = assistanceRequestService.getRequest(this.id)
    }
  }
}
