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
import { RestaurantReviewsFiltersProps } from "../../../../services/interfaces/restaurant";

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
    <div>
      <div className="flex items-center justify-start gap-4 p-2 dark:bg-grey-3">
        <TextField
          id="outlined-basic"
          variant="outlined"
          value={filterText}
          onChange={handleFilterTextChange}
          placeholder="Search..."
          autoComplete="off"
          style={{ marginRight: "16px" }}
        />
        <FormControl fullWidth style={{ marginRight: "16px" }}>
          <InputLabel id="demo-simple-select-label">Sort</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sort}
            label="Sort"
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
          style={{ backgroundColor: "#a94c79", color: "#fefefe" }}
        >
          Clear
        </Button>
      </div>
      <div className="my-2 h-[2px] w-full bg-grey-1" />
    </div>
  );
};

export default RestaurantReviewsFilters;
