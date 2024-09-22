import React from "react";
import { Button, Menu, MenuItem as MyMenuItem } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTranslation } from "react-i18next";

interface FilterMenuProps {
  handleFilterOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleFilterClose: () => void;
  filterAnchorEl: HTMLElement | null;
  handleSortAlphabetically: () => void;
  handleSortPriceAsc: () => void;
  handleSortPriceDesc: () => void;
  handleSortAlcoholAsc: () => void;
  handleSortAlcoholDesc: () => void;
  handleClearFilters: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  handleFilterOpen,
  handleFilterClose,
  filterAnchorEl,
  handleClearFilters,
  handleSortAlphabetically,
  handleSortPriceAsc,
  handleSortPriceDesc,
  handleSortAlcoholAsc,
  handleSortAlcoholDesc,
}) => {

  const { t } = useTranslation("global");

  return (
    <>
      <Button
        startIcon={<FilterAltIcon className="text-secondary-2" />}
        onClick={handleFilterOpen}
      >
        <span className="ml-1 text-black dark:text-white">{t('filters.filter-by')}</span>
      </Button>
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MyMenuItem onClick={handleSortAlphabetically}>
        {t('filters.name')}
        </MyMenuItem>
        <MyMenuItem onClick={handleSortPriceAsc}>{t('filters.price-asc')}</MyMenuItem>
        <MyMenuItem onClick={handleSortPriceDesc}>{t('filters.price-desc')}</MyMenuItem>
        <MyMenuItem onClick={handleSortAlcoholAsc}>
          {t('filters.alcohol-percentage-asc')}
        </MyMenuItem>
        <MyMenuItem onClick={handleSortAlcoholDesc}>
          {t('filters.alcohol-percentage-desc')}
        </MyMenuItem>
        <MyMenuItem onClick={handleClearFilters}>{t('filters.clear')}</MyMenuItem>
      </Menu>
    </>
  );
};

export default FilterMenu;
