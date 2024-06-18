import { Component } from '@angular/core';
import { AssistanceRequestsService } from '../../../services/assistance-requests.service';
import { AssistanceRequest } from '../interfaces/assistance-request';
import { CommonModule } from '@angular/common';
import { Inverter } from '../interfaces/inverter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-tickets-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './system-tickets-list.component.html',
  styleUrl: './system-tickets-list.component.scss'
})
export class SystemTicketsListComponent {

  requests: AssistanceRequest[] = [];
  hasInverterProblem: boolean[] = [];
  hasClusterProblem: boolean[] = [];
  // inverterProblem: { serialNumber: string, model: string }[] = [];
  // batteryProblem: { serialNumber: string, relatedInverter: string }[] = [];

  constructor(private assistanceRequestsService: AssistanceRequestsService, private router: Router) {
    this.requests = assistanceRequestsService.requests;
  }

  setInverterProblem(request: AssistanceRequest) {
    let inverterProblem: { serialNumber: string, model: string }[] = [];
    for (let j = 0; j < request.inverters.inverterInfo.length; j++) {
      if (request.inverters.inverterInfo[j].askSupport) {
        console.log("ask request true" + "j" + j)
        inverterProblem.push({
          serialNumber: request.inverters.inverterInfo[j].serialNumber,
          model: request.inverters.inverterInfo[j].model,
        }
        )
      }
    }
    return inverterProblem;
  }

  setClusterProblem(request: AssistanceRequest) {
    let batteryProblem: { serialNumber: string, relatedInverter: string }[] = [];
    for (let i = 0; i < request.clusters.clusterInfo.length; i++) {
      for (let j = 0; j < request.clusters.clusterInfo[i].batteryInfo.length; j++) {
        if (request.clusters.clusterInfo[i].batteryInfo[j].askSupport) {
          batteryProblem.push(
            {
              serialNumber: request.clusters.clusterInfo[i].batteryInfo[j].serialNumber,
              relatedInverter: request.clusters.clusterInfo[i].relatedInverter,
            }
          )
        }
      }
    }
    return batteryProblem;
  }

  goTo(id: number) {
    this.router.navigate(['/assistanceRequest', id]);
  }

}
