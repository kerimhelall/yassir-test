export interface Customer {
    firstName: string;
    lastName: string;
}

export interface Reservation {
    id: number;
    businessDate: string;
    status: string;
    shift: string;
    start: string;
    end: string;
    quantity: number;
    customer: Customer;
    area: string;
    guestNotes: string;
}

export interface Filter {
    status: string[];
    date: string[];
    shift: string[];
    area: string[];
}