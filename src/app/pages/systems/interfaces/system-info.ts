export interface SystemInfo {
    id: number;
    title: string;
    description: string | null;
    status: null | {
      id: number;
      title: string;
    };
    customerInfo: string | null;
    installationSite: string | null;
    installationDate: string | null;
    devicesInfo: string[];
    ticketsInfo: string[];
  }
