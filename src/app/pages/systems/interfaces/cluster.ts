export interface Cluster {
    batteryVoltage: string,
    batteryType: string,
    batteryModel: string,
    singleBattery: boolean,
    clusternumber: number | null,
    parallelCluster: boolean | null,
    itemsForCluster: number | null,
    clusterInfo: [{
        relatedInverter: string,
        batteryInfo: [{
            serialNumber: string,
            askSupport: boolean,
        }]
    }],
}