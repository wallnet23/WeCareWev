import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AssistanceRequestsService {

  // requests: AssistanceRequest[] = [];
  // latestRequests: AssistanceRequest[] = [];

  // orderRequests() {
  //   this.requests.sort((a, b) => b.date.getTime() - a.date.getTime());
  // }

  // getRequest(id: string) {
  //   return this.requests.find((val) => (val.id.toString() === id));
  // }

  // constructor() {
  //   this.requests = [
  //     {
  //       id: 1,
  //       title: "Cluster Problem",
  //       date: new Date(2023, 4, 17),
  //       problemDescription: "Malfunctioning of the the cluster. ",
  //       status: "Not Solved",
  //       inverters: {
  //         hybridInverter: true,
  //         parallelInverter: false,
  //         powerInverter: "InverterModel",
  //         inverterInfo: [{
  //           serialNumber: "123456",
  //           model: "InverterModel",
  //           askSupport: false,
  //         }],
  //       },
  //       clusters: {
  //         batteryVoltage: "BatteryVoltage",
  //         batteryType: "BatteryType",
  //         batteryModel: "BatteryModel",
  //         singleBattery: true,
  //         clusternumber: 1,
  //         parallelCluster: null,
  //         itemsForCluster: 10,
  //         clusterInfo: [{
  //           relatedInverter: "123456",
  //           batteryInfo: [{
  //             serialNumber: "789012",
  //             askSupport: true,
  //           }]
  //         }],
  //       },
  //     },
  //     {
  //       id: 2,
  //       title: "Inverter and Cluster Problem",
  //       date: new Date(2024, 2, 10),
  //       problemDescription: "Exploded",
  //       status: "Not Solved",
  //       inverters: {
  //         hybridInverter: false,
  //         parallelInverter: true,
  //         powerInverter: "ParallelInverterModel",
  //         inverterInfo: [{
  //           serialNumber: "654321",
  //           model: "ParallelInverterModel",
  //           askSupport: true,
  //         }],
  //       },
  //       clusters: {
  //         batteryVoltage: "AnotherBatteryVoltage",
  //         batteryType: "AnotherBatteryType",
  //         batteryModel: "AnotherBatteryModel",
  //         singleBattery: false,
  //         clusternumber: 2,
  //         parallelCluster: true,
  //         itemsForCluster: 20,
  //         clusterInfo: [{
  //           relatedInverter: "654321",
  //           batteryInfo: [{
  //             serialNumber: "987654",
  //             askSupport: true,
  //           }]
  //         }],
  //       },
  //     }
  //   ];

  //   this.orderRequests();
  //   this.latestRequests = this.requests;
  // }

}
