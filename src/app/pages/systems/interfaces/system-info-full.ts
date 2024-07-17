import { StepFour } from "../components/interfaces/step-four";
import { StepOne } from "../components/interfaces/step-one";
import { StepThree } from "../components/interfaces/step-three";
import { StepTwo } from "../components/interfaces/step-two";
import { ClusterData } from "./clusterData";
import { Inverter, InverterData } from "./inverterData";

export interface SystemInfoFull {
    id: number;
    stepOne: StepOne;
    stepTwo: StepTwo;
    stepThree: StepThree;
    stepFour: StepFour;
    cluster: ClusterData;
    inverter: InverterData;
}
