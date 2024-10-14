import { Cluster } from "../../interfaces/clusterData";
import { Inverter } from "../../interfaces/inverterData";

export interface StepSix {
  cluster_parallel: number | null;
  clusters_list: Cluster[];
  inverters_list: Inverter[];
  cluster_numberdevices: number | null;
  cluster_singlebattery: number | null;
}
