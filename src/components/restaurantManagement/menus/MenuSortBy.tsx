import React, {useContext, useState} from "react";
import { Button, Menu, MenuItem as MyMenuItem } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ArrowUpward, KeyboardArrowDown, KeyboardArrowUp, Sort, SortByAlpha, SwapVert } from "@mui/icons-material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

interface MenuSortBy {
  handleSortOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSortClose: () => void;
  sortAnchorElement: HTMLElement | null;
  handleSortAlphabeticallyAsc: () => void;
  handleSortAlphabeticallyDesc: () => void;
  handleSortPriceAsc: () => void;
  handleSortPriceDesc: () => void;
  handleSortAlcoholAsc: () => void;
  handleSortAlcoholDesc: () => void;
  handleClearSort: () => void;
}

const MenuOrderBy: React.FC<MenuSortBy> = ({
  handleSortOpen,
  handleSortClose,
  sortAnchorElement,
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
        className="dark:bg-grey-5 dark:hover:bg-grey-6 dark:text-white text-black hover:bg-grey-0"
        startIcon={<SwapVert className="text-secondary-2" />}
        onClick={handleSortOpen}
      >
        <span className="ml-1 ">{t("restaurant-management.menu.sort")}</span>
      </Button>
      <Menu
        anchorEl={sortAnchorElement}
        open={!!sortAnchorElement}
        onClose={handleSortClose}
      >
        <MyMenuItem 
        className="dark:bg-grey-5 dark:hover:bg-grey-6 dark:text-white text-black hover:bg-grey-0"
        onClick={()=>{
          setPriceSort(0)
          setAlcoholSort(0)
          if(nameSort===0 || nameSort===2){
            handleSortAlphabeticallyAsc()
            setNameSort(1)
          } else if(nameSort===1){
            handleSortAlphabeticallyDesc()
            setNameSort(2)
          }
        }} 
        > {t("restaurant-management.menu.name")} 
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

        <MyMenuItem
        className="dark:bg-grey-5 dark:hover:bg-grey-6 dark:text-white text-black hover:bg-grey-0"
        onClick={()=>{
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

        <MyMenuItem
        className="dark:bg-grey-5 dark:hover:bg-grey-6 dark:text-white text-black hover:bg-grey-0"
        onClick={()=>{
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
