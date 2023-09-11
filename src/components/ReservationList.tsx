
import { useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { useReservationContext } from '../contexts/ReservationContext/ReservationContext';
import { Reservation } from '../contexts/ReservationContext/types';
import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

const ReservationList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { filteredReservations, sortField, sortDirection, setSortDirection, setSortField } = useReservationContext();

    const headCells = [
        {
            id: 'id',
            label: 'ID',
            enableSort: false
        },
        {
            id: 'businessDate',
            label: 'Date',
            enableSort: false
        },
        {
            id: 'status',
            label: 'Status',
            enableSort: false
        },
        {
            id: 'shift',
            label: 'Shift',
            enableSort: false
        },
        {
            id: 'quantity',
            label: 'Quantity',
            enableSort: true
        },
        {
            id: 'customerName',
            label: 'Customer Name',
            enableSort: true
        },
        {
            id: 'area',
            label: 'Area',
            enableSort: false
        },
        {
            id: 'guestNotes',
            label: 'Guest notes',
            enableSort: false
        },
    ];

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = useMemo(
        () =>
            filteredReservations.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [filteredReservations, page, rowsPerPage],
    );

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Reservation,
    ) => {
        const isAsc = sortField === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(property);
    };

    const createSortHandler =
        (property: keyof Reservation) => (event: React.MouseEvent<unknown>) => {
            handleRequestSort(event, property);
        };


    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Reservations table">
                    <TableHead>
                        <TableRow>
                            {headCells.map((cell) => (
                                cell.enableSort ? (
                                    <TableCell key={cell.id}>
                                        <TableSortLabel
                                            active={sortField === cell.id}
                                            direction={sortField === cell.id ? sortDirection : 'asc'}
                                            onClick={createSortHandler(cell.id as keyof Reservation)}
                                        >
                                            {cell.label}
                                            {sortField === cell.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                ) :
                                    (<TableCell key={cell.id}>{cell.label}</TableCell>)))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((reservation) => (
                            <TableRow
                                key={reservation.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {reservation.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {reservation.businessDate}
                                </TableCell>
                                <TableCell>{reservation.status}</TableCell>
                                <TableCell>{reservation.shift}</TableCell>
                                <TableCell>{reservation.quantity}</TableCell>
                                <TableCell>{reservation.customer.firstName} {reservation.customer.lastName}</TableCell>
                                <TableCell>{reservation.area}</TableCell>
                                <TableCell>{reservation?.guestNotes || 'None'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredReservations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>

    );

}

export default ReservationList