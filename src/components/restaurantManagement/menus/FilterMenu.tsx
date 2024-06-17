import React from 'react';
import { Button, Menu, MenuItem as MyMenuItem } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface FilterMenuProps {
    handleFilterOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleFilterClose: () => void;
    filterAnchorEl: HTMLElement | null;
    handleSortAlphabetically: () => void;
    handleSortPriceAsc: ()  => void;
    handleSortPriceDesc: ()  => void;
    handleSortAlcoholAsc: ()  => void;
    handleSortAlcoholDesc: ()  => void;
    handleClearFilters: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = 
    ({handleFilterOpen, handleFilterClose, filterAnchorEl, handleClearFilters,
        handleSortAlphabetically, handleSortPriceAsc, handleSortPriceDesc, handleSortAlcoholAsc, handleSortAlcoholDesc }) => {
    return (
        <>
            <Button
                startIcon={<FilterAltIcon className="text-secondary-2" />}
                onClick={handleFilterOpen}
            >
                <span className="ml-1 text-black dark:text-white">FILTER BY</span>
            </Button>
            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
            >
                <MyMenuItem onClick={handleSortAlphabetically}>Name alphabetically</MyMenuItem>
                <MyMenuItem onClick={handleSortPriceAsc}>Price ascending</MyMenuItem>
                <MyMenuItem onClick={handleSortPriceDesc}>Price descending</MyMenuItem>
                <MyMenuItem onClick={handleSortAlcoholAsc}>Alcohol percentage ascending</MyMenuItem>
                <MyMenuItem onClick={handleSortAlcoholDesc}>Alcohol percentage descending</MyMenuItem>
                <MyMenuItem onClick={handleClearFilters}>Clear filters</MyMenuItem>
            </Menu>
        </>
    );
};

export default FilterMenu;
