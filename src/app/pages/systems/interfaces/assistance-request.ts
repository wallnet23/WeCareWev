import { Cluster } from "./cluster";
import { Inverter } from "./inverter";

export interface AssistanceRequest {
    id: number;
    title: string;
    date: Date;
    problemDescription: string;
    status: string;
    inverters: Inverter;
    clusters: Cluster;
}