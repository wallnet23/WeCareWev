export interface SystemInfo {
    status: string,
    systemName: string,
    description: string,
    supplierInfo: {
        name: string,
        address: string,
        country: string,
        contact: string,
        email: string,
        invoiceDate: string,
    },
    installationSite: {
        country: string,
        address: string,
        city: string,
        postalCode: number | null,
    },
    productGeneralInfo: {
        installationDate: string,
        sysComposition: string,
        wecoProducts: string,
        brand: string,
    },
    inverters: {
        hybridInverter: boolean,
        parallelInverter: boolean,
        powerInverter: string,
        inverterInfo: [{
            serialNumber: string,
            model: string,
            askSupport: boolean,
        }],
    },
    clusters: {
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
    additionalInfo: {
        problemOccurred: string,
        description: string,
    }
}
