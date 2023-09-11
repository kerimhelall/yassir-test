import { useMemo } from "react";
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useReservationContext } from "../contexts/ReservationContext/ReservationContext";
import { Filter } from "../contexts/ReservationContext/types";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type FilterOptions = {
    [key: string]: { key: string; value: string }[];
};

function formatWord(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const filterOptions: FilterOptions = {
    status: [
        {
            key: 'Confirmed',
            value: 'CONFIRMED'
        },
        {
            key: 'Seated',
            value: 'SEATED'
        },

        {
            key: 'Checked Out',
            value: 'CHECKED OUT'
        },
        {
            key: 'Not Confirmed',
            value: 'NOT CONFIRMED'
        }
    ],
    date: [

        {
            key: 'Past Dates',
            value: 'Past Dates'
        },

        {
            key: 'Future Dates',
            value: 'Future Dates'
        }
    ],
    shift: [

        {
            key: 'Breakfast',
            value: 'BREAKFAST'
        },

        {
            key: 'Lunch',
            value: 'LUNCH'
        },

        {
            key: 'Dinner',
            value: 'DINNER'
        }
    ],
    area: [

        {
            key: 'Bar',
            value: 'BAR'
        },

        {
            key: 'Main Room',
            value: 'MAIN ROOM'
        }
    ]
}

const ReservationFilter = () => {
    const { setFilters, filters } = useReservationContext();

    const selectedFilters = useMemo(() => {
        const flattenedValues = Object.values(filters).flat();
        const textValues = flattenedValues.filter((value) => typeof value === 'string');
        return textValues;
    }, [filters]);

    const handleChange = (
        value: string,
        filterType: keyof Filter
    ) => {
        console.log("Filter Type:", filterType);
        console.log("Selected Value:", value);

        setFilters((prevFilters: Filter) => ({
            ...prevFilters,
            [filterType]: prevFilters[filterType].includes(value)
                ? prevFilters[filterType].filter((item) => item !== value) // Deselect
                : [...prevFilters[filterType], value], // Select
        }));
    };



    return (
        <FormControl sx={{ m: 1, width: 300, position: 'relative', bottom: 20 }}>
            <InputLabel>Filter</InputLabel>
            <Select
                multiple
                value={selectedFilters}
                input={<OutlinedInput label="Filter" />}
                renderValue={(selected: any) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value: string) => (
                            <Chip key={value} label={formatWord(value)} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {Object.keys(filterOptions).map((filterType: string) => (
                    <div key={filterType}>
                        <MenuItem key={filterType} disabled>
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </MenuItem>
                        {filterOptions[filterType].map((filterOption: { key: string, value: string }) => (
                            <MenuItem
                                key={`${filterType}_${filterOption.key}`}
                                value={filterOption.value}
                                onClick={() => handleChange(filterOption.value, filterType as keyof Filter)}
                            >
                                {filterOption.key}
                            </MenuItem>
                        ))}
                    </div>
                ))}
            </Select>
        </FormControl>
    )
}

export default ReservationFilter;