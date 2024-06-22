import { Component } from '@angular/core';
import { AssistanceRequestsService } from '../../../services/assistance-requests.service';
import { CommonModule } from '@angular/common';
import { Inverter } from '../interfaces/inverter';
import { Router } from '@angular/router';
import { Ticket } from '../interfaces/ticket';

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

  tickets: Ticket[] = [];
  hasInverterProblem: boolean[] = [];
  hasClusterProblem: boolean[] = [];
  // inverterProblem: { serialNumber: string, model: string }[] = [];
  // batteryProblem: { serialNumber: string, relatedInverter: string }[] = [];

  constructor(private assistanceRequestsService: AssistanceRequestsService, private router: Router) {
    
  }

  setInverterProblem(ticket: Ticket) {
    // let inverterProblem: { serialNumber: string, model: string }[] = [];
    // for (let j = 0; j < request.inverters.inverterInfo.length; j++) {
    //   if (request.inverters.inverterInfo[j].askSupport) {
    //     console.log("ask request true" + "j" + j)
    //     inverterProblem.push({
    //       serialNumber: request.inverters.inverterInfo[j].serialNumber,
    //       model: request.inverters.inverterInfo[j].model,
    //     }
    //     )
    //   }
    // }
    // return inverterProblem;
    return null;
  }

  setClusterProblem(ticket: Ticket) {
    // let batteryProblem: { serialNumber: string, relatedInverter: string }[] = [];
    // for (let i = 0; i < request.clusters.clusterInfo.length; i++) {
    //   for (let j = 0; j < request.clusters.clusterInfo[i].batteryInfo.length; j++) {
    //     if (request.clusters.clusterInfo[i].batteryInfo[j].askSupport) {
    //       batteryProblem.push(
    //         {
    //           serialNumber: request.clusters.clusterInfo[i].batteryInfo[j].serialNumber,
    //           relatedInverter: request.clusters.clusterInfo[i].relatedInverter,
    //         }
    //       )
    //     }
    //   }
    // }
    // return batteryProblem;
    return null;
  }

  goTo(id: number) {
    this.router.navigate(['/assistanceRequest', id]);
  }

}
