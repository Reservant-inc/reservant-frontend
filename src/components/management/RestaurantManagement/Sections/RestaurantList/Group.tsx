import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { fetchGET, getImage } from "../../../../../services/APIconn";
import { GroupProps } from "../../../../../services/interfaces";
import { RestaurantType } from "../../../../../services/types";

const Group: React.FC<GroupProps> = ({
  restaurantGroupId,
  name,
  restaurants,
  filter
}) => {
  const [t] = useTranslation("global");

  const [open, setOpen] = React.useState(filter!=="");

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(()=>{setOpen(filter!=="")},[filter])

  return (
    <div className={"text-sm text-black dark:text-white"}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={name} />
        {open ?  <ExpandMore /> : <ExpandLess />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
              <div className="flex w-full p-2 gap-4">
                {restaurants.map((restaurant) => (
                  <button className="h-12 w-48 shadow-md cursor-pointer flex items-center justify-center rounded-lg p-2 gap-4 transform hover:scale-105 transition border border-grey-1">
                    <h1 className="text-md">{restaurant.name}</h1>
                  </button>
                ))}
              </div>
      </Collapse>
      <div className="h-[2px] w-full bg-grey-1" />
    </div>
  );
};

export default Group;
