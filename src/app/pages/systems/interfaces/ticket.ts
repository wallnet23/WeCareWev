export interface Ticket {
    id: number;
    title: string;
    date_ticket: string;
    description: string;
    idsystem: number | null;
    status?: string;
}
