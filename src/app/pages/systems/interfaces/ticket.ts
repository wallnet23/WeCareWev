export interface Ticket {
    id: number;
    name: string;
    date: string;
    description: string;
    system: string | null;
    status: string;
}