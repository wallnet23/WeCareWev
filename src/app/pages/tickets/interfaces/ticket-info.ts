import { Image } from "../../systems/components/interfaces/image";

export interface TicketInfo {
    id: number;
    progressive: string | null;
    openingDate: string | null;
    description: string | null;
    requestType: string | null;
    email: string | null;
    attachedFiles: Image[];
    inverterList: {id: number, sn: string}[];
    batteryList: {id: number, sn: string}[];
}