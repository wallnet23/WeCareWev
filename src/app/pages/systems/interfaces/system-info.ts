export interface SystemInfo {
    id: number;
    system_name: string;
    system_description: string | null;
    status: null | {
      id: number;
      name: string;
    };
    customerInfo: string | null;
    installationSite: string | null;
    installationDate: string | null;
    devicesInfo: string[];
    ticketsInfo: string[];
  }
