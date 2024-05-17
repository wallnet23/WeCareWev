import { InstallationSite } from "./installation-site"
import { SupplierInfo } from "./supplier-info"
import { ProductGeneralInfo } from "./product-general-info"
import { Inverter } from "./inverter"
import { Cluster } from "./cluster"

export interface SystemInfo {
    status: string
    systemName: string,
    description: string,
    supplierInfo: SupplierInfo,
    installationSite: InstallationSite,
    productGeneralInfo: ProductGeneralInfo,
    inverters: Inverter,
    clusters: Cluster,
    additionalInfo: {
        problemOccurred: string,
        description: string,
    }
}