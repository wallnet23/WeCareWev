import { Injectable } from '@angular/core';
//import { SystemInfo } from '../pages/systems/interfaces/full-system-interface';
import { BehaviorSubject, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoadSystemsService {

  // filteredSystems: SystemInfo[] = [];
  // systems: SystemInfo[] = [];

  // getSystem(name: string): SystemInfo {
  //   let foundSystem = this.systems.find(system => system.systemName === name);
  //   let emptySystem = this.emptySystem;
  //   return foundSystem ? foundSystem : emptySystem;
  // }

  // filterSystems(text: string) {
  //   this.filteredSystems = this.systems.filter(item => {
  //     item.systemName.toLowerCase().includes(text.toLowerCase());
  //   });
  // }

  // getFilteredSystems(): Observable<any[]> {
  //   return of(this.filteredSystems);
  // }

  // getAllSystems() {
  //   return this.systems;
  // }

  // get emptySystem(): SystemInfo {
  //   return {
  //     status: "Incomplete",
  //     systemName: "",
  //     description: "",
  //     supplierInfo: {
  //       name: "",
  //       address: "",
  //       country: "",
  //       contact: "",
  //       email: "",
  //       invoiceDate: "",
  //     },
  //     installationSite: {
  //       country: "",
  //       address: "",
  //       city: "",
  //       postalCode: null,
  //     },
  //     productGeneralInfo: {
  //       installationDate: "",
  //       sysComposition: "",
  //       wecoProducts: "",
  //       brand: "",
  //     },
  //     inverters: {
  //       hybridInverter: false,
  //       parallelInverter: false,
  //       powerInverter: "",
  //       inverterInfo: [{
  //         serialNumber: "",
  //         model: "",
  //         askSupport: false,
  //       }],
  //     },
  //     clusters: {
  //       batteryVoltage: "",
  //       batteryType: "",
  //       batteryModel: "",
  //       singleBattery: false,
  //       clusternumber: 0,
  //       parallelCluster: null,
  //       itemsForCluster: 0,
  //       clusterInfo: [{
  //         relatedInverter: "",
  //         batteryInfo: [{
  //           serialNumber: "",
  //           askSupport: false,
  //         }]
  //       }],
  //     },
  //     additionalInfo: {
  //       problemOccurred: "",
  //       description: "",
  //     }
  //   };
  // }

  // constructor() {
  //   this.systems = [
  //     {
  //       status: 'Approved',
  //       systemName: "MySystem",
  //       description: "Description of MySystem",
  //       supplierInfo: {
  //         name: "SupplierName",
  //         address: "SupplierAddress",
  //         country: "SupplierCountry",
  //         contact: "SupplierContact",
  //         email: "supplier@example.com",
  //         invoiceDate: "2024-05-10",
  //       },
  //       installationSite: {
  //         country: "InstallationCountry",
  //         address: "InstallationAddress",
  //         city: "InstallationCity",
  //         postalCode: 12345,
  //       },
  //       productGeneralInfo: {
  //         installationDate: "2024-05-10",
  //         sysComposition: "Composition of the system",
  //         wecoProducts: "Weco products used",
  //         brand: "BrandName",
  //       },
  //       inverters: {
  //         hybridInverter: true,
  //         parallelInverter: false,
  //         powerInverter: "InverterModel",
  //         inverterInfo: [{
  //           serialNumber: "123456",
  //           model: "InverterModel",
  //           askSupport: true,
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
  //             askSupport: false,
  //           }]
  //         }],
  //       },
  //       additionalInfo: {
  //         problemOccurred: "Problem occurred during installation",
  //         description: "Additional description of the system",
  //       }
  //     },
  //     {
  //       status: 'Waiting for approval',
  //       systemName: "AnotherSystem",
  //       description: "Description of AnotherSystem",
  //       supplierInfo: {
  //           name: "SupplierName2",
  //           address: "SupplierAddress2",
  //           country: "SupplierCountry2",
  //           contact: "SupplierContact2",
  //           email: "supplier2@example.com",
  //           invoiceDate: "2024-05-15",
  //       },
  //       installationSite: {
  //           country: "InstallationCountry2",
  //           address: "InstallationAddress2",
  //           city: "InstallationCity2",
  //           postalCode: 54321,
  //       },
  //       productGeneralInfo: {
  //           installationDate: "2024-05-15",
  //           sysComposition: "Composition of AnotherSystem",
  //           wecoProducts: "Other Weco products used",
  //           brand: "AnotherBrandName",
  //       },
  //       inverters: {
  //           hybridInverter: false,
  //           parallelInverter: true,
  //           powerInverter: "ParallelInverterModel",
  //           inverterInfo: [{
  //               serialNumber: "654321",
  //               model: "ParallelInverterModel",
  //               askSupport: true,
  //           }],
  //       },
  //       clusters: {
  //           batteryVoltage: "AnotherBatteryVoltage",
  //           batteryType: "AnotherBatteryType",
  //           batteryModel: "AnotherBatteryModel",
  //           singleBattery: false,
  //           clusternumber: 2,
  //           parallelCluster: true,
  //           itemsForCluster: 20,
  //           clusterInfo: [{
  //               relatedInverter: "654321",
  //               batteryInfo: [{
  //                   serialNumber: "987654",
  //                   askSupport: true,
  //               }]
  //           }],
  //       },
  //       additionalInfo: {
  //           problemOccurred: "Problem occurred during setup",
  //           description: "Additional description of AnotherSystem",
  //       }
  //     }
  //   ];

  //   this.filteredSystems = this.systems;
  // }
}
