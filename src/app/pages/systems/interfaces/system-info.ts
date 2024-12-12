import { SystemStatus } from "./system-status";

export interface SystemInfo {
    id: number;
    system_name: string;
    system_description: string | null;
    status: null | SystemStatus;
    customerInfo: string | null;
    installationSite: string | null;
    installationDate: string | null;
    devicesInfo: {num_inverter: number, num_batteries:number};
    ticketsInfo: string[];
    product_systemweco: null | number;
  }
