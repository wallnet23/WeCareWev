import { Component } from '@angular/core';
import { AssistanceRequestsService } from '../../../services/assistance-requests.service';
import { ActivatedRoute } from '@angular/router';
import { AssistanceRequest } from '../interfaces/assistance-request';

@Component({
  selector: 'app-assistance-request',
  standalone: true,
  imports: [],
  templateUrl: './assistance-request.component.html',
  styleUrl: './assistance-request.component.scss'
})
export class AssistanceRequestComponent {

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
