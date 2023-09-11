import { TextField } from "@mui/material";
import { useReservationContext } from "../contexts/ReservationContext/ReservationContext";

const ReservationSearch = () => {
    const { searchQuery, setSearchQuery } = useReservationContext();

    const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    return (
        <>
            <TextField id="outlined-basic" label="Customer Name" variant="standard" size="small" style={{ marginRight: 10 }} value={searchQuery} onChange={onChangeSearchQuery} />
        </>
    )
}

export default ReservationSearch;