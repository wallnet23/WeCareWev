export interface Device {
    serial_number: string;
    type: number | null;
    warranty_performance: number | null;
    warranty_device: number | null;
    warranty_performance_expiration: string | null;
    warranty_device_expiration: string | null;
}
