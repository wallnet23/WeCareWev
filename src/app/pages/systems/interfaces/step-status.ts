export interface StepStatus {
    step: number;
    status: Status[];
}

export interface Status {
    idstatus: number;
    name_status: string;
    color: string;
    message: string | null;
    date: string | null;
}