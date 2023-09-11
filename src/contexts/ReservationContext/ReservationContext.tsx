import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Reservation, Filter } from './types';
import axios from 'axios';

interface ReservationContextType {
    reservations: Reservation[];
    filteredReservations: Reservation[];
    applyFilters: (filters: Filter) => void;
    applySort: (field: string) => void;
    searchReservations: (query: string) => void;
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    sortField: string | null;
    setSortField: React.Dispatch<React.SetStateAction<string | null>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    sortDirection: "desc" | "asc" | undefined;
    setSortDirection: React.Dispatch<React.SetStateAction<"desc" | "asc" | undefined>>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservationContext = (): ReservationContextType => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservationContext must be used within a ReservationProvider');
    }
    return context;
};

interface Props {
    children: ReactNode;
}

export const ReservationProvider: React.FC<Props> = ({ children }: Props) => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(reservations);
    const [filters, setFilters] = useState<Filter>({ status: [], date: [], shift: [], area: [] });
    const [sortField, setSortField] = useState<string | null>('');
    const [sortDirection, setSortDirection] = useState<"desc" | "asc" | undefined>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        // Fetch data from Gist URL
        axios.get<{ reservations: Reservation[] }>('https://gist.githubusercontent.com/dhwissem/5e7c48768af1eb721d9e2e1d874cd9a0/raw/6530e16c5aa203c1a1c41e5fb73595870407cb56/serverResponse.json')
            .then((response) => {
                const data = response.data;
                setReservations(data.reservations);
                setFilteredReservations(data.reservations)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const applyFilters = useCallback(() => {
        let filteredReservationsCopy = [...reservations];

        // Filter by 'status'
        if (filters.status.length > 0) {
            filteredReservationsCopy = filteredReservationsCopy.filter((reservation) =>
                filters.status.includes(reservation.status)
            );
        }

        // Filter by 'date'
        if (filters.date.length > 0) {
            filteredReservationsCopy = filteredReservationsCopy.filter((reservation) =>
                filters.date.includes('Future Dates')
                    ? new Date(reservation.start) >= new Date()
                    : new Date(reservation.start) < new Date()
            );
        }

        // Filter by 'shift'
        if (filters.shift.length > 0) {
            filteredReservationsCopy = filteredReservationsCopy.filter((reservation) =>
                filters.shift.includes(reservation.shift)
            );
        }

        // Filter by 'area'
        if (filters.area.length > 0) {
            filteredReservationsCopy = filteredReservationsCopy.filter((reservation) =>
                filters.area.includes(reservation.area)
            );
        }

        setFilteredReservations(filteredReservationsCopy);
    }, [filters, reservations]);


    // Apply sorting to reservations
    const applySort = useCallback(() => {
        if (sortField !== '' && sortField !== null) {
            let sortedReservationsCopy = [...filteredReservations];

            if (sortField === 'quantity') {
                sortedReservationsCopy.sort((a, b) => {
                    if (sortDirection === 'asc') {
                        return a.quantity - b.quantity;
                    } else if (sortDirection === 'desc') {
                        return b.quantity - a.quantity;
                    }
                    return 0; // Handle other cases or no sorting
                });
            } else if (sortField === 'customerName') {
                sortedReservationsCopy.sort((a, b) => {
                    const nameA = `${a.customer.firstName} ${a.customer.lastName}`;
                    const nameB = `${b.customer.firstName} ${b.customer.lastName}`;

                    if (sortDirection === 'asc') {
                        return nameA.localeCompare(nameB);
                    } else if (sortDirection === 'desc') {
                        return nameB.localeCompare(nameA);
                    }
                    return 0;
                });
            }

            setFilteredReservations(sortedReservationsCopy);
        }
    }, [filteredReservations, sortField, sortDirection]);



    // Search reservations by name and surname
    const searchReservations = useCallback(() => {
        if (searchQuery !== '') {
            const query = searchQuery.toLowerCase().trim(); // Convert the query to lowercase and remove leading/trailing spaces

            const filteredReservationsCopy = reservations.filter((reservation) => {
                // Combine the first name and last name into a single string for searching
                const fullName = `${reservation.customer.firstName} ${reservation.customer.lastName}`.toLowerCase();

                // Check if the full name contains the search query
                return fullName.includes(query);
            });

            setFilteredReservations(filteredReservationsCopy);
        }
    }, [searchQuery, reservations]);

    useEffect(() => {
        applyFilters();
        applySort();
        searchReservations();
    }, [filters, sortField, searchQuery, reservations, sortDirection])


    return (
        <ReservationContext.Provider
            value={{
                reservations,
                filteredReservations,
                applyFilters,
                applySort,
                searchReservations,
                setFilters,
                setSortField,
                searchQuery,
                setSearchQuery,
                sortField,
                sortDirection,
                setSortDirection,
                filters
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
};
