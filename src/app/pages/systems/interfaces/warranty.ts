import { Cluster } from "./cluster";
import { Inverter } from "./inverter";

export interface Warranty {
    id: number;
    title: string;
    date: Date;
    problemDescription: string;
    status: string;
    inverters: Inverter;
    clusters: Cluster;
}