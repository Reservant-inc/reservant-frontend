import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";
import { RestaurantType } from "../../../../services/types";

interface GroupProps {
  name: string;
  filter: string;
  restaurants: RestaurantType[];
  handleChangeActiveRestaurant: (restaurantGroupId: number) => void;
  setActiveSectionName: (sectionName: string) => void;
}

const Group: React.FC<GroupProps> = ({
  name,
  restaurants,
  filter,
  handleChangeActiveRestaurant,
  setActiveSectionName
}) => {
  const [t] = useTranslation("global");

  const [open, setOpen] = React.useState(filter!=="");

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSubmit = (id: number, name: string) => {
    setActiveSectionName(name)
    handleChangeActiveRestaurant(id)  
  }

  useEffect(()=>{setOpen(filter!=="")},[filter])

  return (
    <div className={"text-sm text-black dark:text-white"}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={name} />
        {open ?  <ExpandMore /> : <ExpandLess />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
              <div className="flex w-full px-2 pb-2 gap-4">
                {restaurants.map((restaurant) => (
                  <Button className="border-2 border-grey-1 text-black hover:bg-grey-0 w-[10rem] h-10" variant="outlined" onClick={() => handleSubmit(restaurant.restaurantId, restaurant.name)}>{restaurant.name}</Button>
                ))}
              </div>
      </Collapse>
      <div className="h-[2px] w-full bg-grey-1" />
    </div>
  );
};

export default Group;
