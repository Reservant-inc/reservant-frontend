import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GroupProps } from "../../../services/interfaces";
import { RestaurantType } from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import Loader from "../../Loader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import { ListItemIcon } from "@mui/material";

const Group: React.FC<GroupProps> = ({
  id,
  name,
  handleChangeActiveRestaurant,
  activeRestaurantId,
}) => {
  const [t] = useTranslation("global");
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGET(`/my-restaurant-groups/${id}`);
        setRestaurants(response.restaurants);
      } catch (error) {
        console.error("Error fetching groups: ", error);
      }
    };

    fetchData();
  }, [id]);

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={"text-sm text-black dark:text-white"}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <div className="p-2">
            {!(restaurants.length === 0) ? (
              <>
                {restaurants.map((restaurant) => (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    key={restaurant.id}
                    onClick={() => handleChangeActiveRestaurant(restaurant.id)}
                  >
                    <ListItemIcon>
                      <RemoveSharpIcon className="dark:fill-white"/>
                    </ListItemIcon>
                    {restaurant.name}
                  </ListItemButton>
                ))}
              </>
            ) : (
              <Loader />
            )}
          </div>
        </List>
      </Collapse>
      <div className="w-full h-[2px] bg-grey-1"/>
    </div>
  );
};

export default Group;
