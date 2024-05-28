import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";

interface RestaurantReviewsFiltersProps {
  sort: string;
  setSort: any; // zmienic later
  filterText: string;
  setFilterText: (text: string) => void;
}

const RestaurantReviewsFilters: React.FC<RestaurantReviewsFiltersProps> = ({
  sort,
  setSort,
  filterText,
  setFilterText,
}) => {
  const handleChange = (e: SelectChangeEvent) => {
    setSort(e.target.value as string);
  };

  const handleCleanFilter = () => {
    setSort("");
    setFilterText("");
  };

  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  return (
    <div className="flex items-center justify-start p-2 dark:bg-grey-3 ">
      <TextField
        id="outlined-basic"
        variant="outlined"
        value={filterText}
        onChange={handleFilterTextChange}
        placeholder="Search..."
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sort</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="sort"
          onChange={handleChange}
        >
          <MenuItem value="1">Alfabetycznie</MenuItem>
          <MenuItem value="2">Od najnowszych</MenuItem>
          <MenuItem value="3">Rosnąco</MenuItem>
          <MenuItem value="4">Malejąco</MenuItem>
        </Select>
      </FormControl>
      <Button
        id="RestaurantReviewsFiltersClearButton"
        onClick={handleCleanFilter}
        variant="contained"
      >
        Clear
      </Button>
    </div>
  );
};

export default RestaurantReviewsFilters;
