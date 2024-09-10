import React, {useContext, useState} from "react";
import { Button, Menu, MenuItem as MyMenuItem } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ArrowUpward, KeyboardArrowDown, KeyboardArrowUp, Sort, SortByAlpha, SwapVert } from "@mui/icons-material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

interface MenuOrderBy {
  handleFilterOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleFilterClose: () => void;
  filterAnchorEl: HTMLElement | null;
  handleSortAlphabeticallyAsc: () => void;
  handleSortAlphabeticallyDesc: () => void;
  handleSortPriceAsc: () => void;
  handleSortPriceDesc: () => void;
  handleSortAlcoholAsc: () => void;
  handleSortAlcoholDesc: () => void;
  handleClearSort: () => void;
}

const MenuOrderBy: React.FC<MenuOrderBy> = ({
  handleFilterOpen,
  handleFilterClose,
  filterAnchorEl,
  handleClearSort,
  handleSortAlphabeticallyAsc,
  handleSortAlphabeticallyDesc,
  handleSortPriceAsc,
  handleSortPriceDesc,
  handleSortAlcoholAsc,
  handleSortAlcoholDesc,
}) => {

  const { t } = useTranslation("global");

  const [priceSort, setPriceSort] = useState<Number>(0)
  const [nameSort, setNameSort] = useState<Number>(0)
  const [alcoholSort, setAlcoholSort] = useState<Number>(0)

  return (
    <>
      <Button
        startIcon={<SwapVert className="text-secondary-2" />}
        onClick={handleFilterOpen}
      >
        <span className="ml-1 text-black dark:text-white">{t("restaurant-management.menu.sort")}</span>
      </Button>
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MyMenuItem onClick={()=>{
          setPriceSort(0)
          setAlcoholSort(0)
          if(nameSort===0 || nameSort===2){
            handleSortAlphabeticallyAsc()
            setNameSort(1)
          } else if(nameSort===1){
            handleSortAlphabeticallyDesc()
            setNameSort(2)
          }
        }}> {t("restaurant-management.menu.name")} 
          {
            (nameSort !== 0) 
            ?
              (nameSort === 1 )
              ?
              <KeyboardArrowUp/>
              :
              <KeyboardArrowDown/>
            :
            <span/>
          } 
        </MyMenuItem>

        <MyMenuItem onClick={()=>{
          setNameSort(0)
          setAlcoholSort(0)
          if(priceSort===0 || priceSort===2){
            handleSortPriceAsc()
            setPriceSort(1)
          } else if(priceSort===1){
            handleSortPriceDesc()
            setPriceSort(2)
          }
        }}> {t("restaurant-management.menu.menuItemPrice")} 
          {
            (priceSort !== 0) 
            ?
              (priceSort === 1 )
              ?
              <KeyboardArrowUp/>
              :
              <KeyboardArrowDown/>
            :
            <span/>
          } 
        </MyMenuItem>

        <MyMenuItem onClick={()=>{
          setNameSort(0)
          setPriceSort(0)
          if(alcoholSort===0 || alcoholSort===2){
            handleSortAlcoholAsc()
            setAlcoholSort(1)
          } else if(alcoholSort===1){
            handleSortAlcoholDesc()
            setAlcoholSort(2)
          }
        }}> {t("restaurant-management.menu.menuItemAlcoholPercentage")} 
          {
            (alcoholSort !== 0) 
            ?
              (alcoholSort === 1 )
              ?
              <KeyboardArrowUp/>
              :
              <KeyboardArrowDown/>
            :
            <span/>
          } 
        </MyMenuItem>
      </Menu>
    </>
  );
};

export default MenuOrderBy;
