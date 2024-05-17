export interface Inverter {
    hybridInverter: boolean,
    parallelInverter: boolean,
    powerInverter: string,
    inverterInfo: [{
        serialNumber: string,
        model: string,
        askSupport: boolean,
    }],
}