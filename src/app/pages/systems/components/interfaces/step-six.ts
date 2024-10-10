import { Cluster } from "../../interfaces/clusterData";

export interface StepSix {
  cluster_parallel: number | null;
  clusters_list: Cluster[];
  cluster_numberdevices: number | null;
  cluster_singlebattery: number | null;
}
