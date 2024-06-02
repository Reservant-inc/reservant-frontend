import { Button } from "@mui/material";
import React, { useState } from "react";
import MenuItemComponent from "./MenuItemComponent";
import { MenuItem } from "../../../services/interfaces";

interface RestaurantMenuViewProps {
  addToCart: (item: MenuItem) => void;
}

const RestaurantMenuView: React.FC<RestaurantMenuViewProps> = ({
  addToCart,
}) => {
  const [menus, setMenus] = useState([
    {
      id: 0,
      name: "Menu 1",
      alternateName: "menu 1 alt",
      menuType: "Food",
      dateFrom: "2024-05-21",
      dateUntil: "2024-05-22",
      menuItems: [
        {
          id: 0,
          price: 500,
          name: "Dish 1",
          alternateName: "string",
          alcoholPercentage: 100,
          photo: "string",
          description: "Opis 1",
        },
        {
          id: 1,
          price: 300,
          name: "Dish 2",
          alternateName: "string",
          alcoholPercentage: 0,
          photo: "string",
          description: "Opis 2",
        },
        {
          id: 2,
          price: 10,
          name: "Dish 3",
          alternateName: "string",
          alcoholPercentage: 0,
          photo: "string",
          description: "Opis 3",
        },
      ],
    },
    {
      id: 1,
      name: "Menu 2",
      alternateName: "menu 2 alt",
      menuType: "Drinks",
      dateFrom: "2024-05-21",
      dateUntil: "2024-05-23",
      menuItems: [
        {
          id: 0,
          price: 140,
          name: "Drink 1",
          alternateName: "string",
          alcoholPercentage: 100,
          photo: "string",
          description: "Opis 1",
        },
        {
          id: 1,
          price: 300,
          name: "Drink 2",
          alternateName: "string",
          alcoholPercentage: 0,
          photo: "string",
          description: "",
        },
      ],
    },
  ]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const handleMenuClick = (id: number) => {
    setActiveMenuId(id === activeMenuId ? null : id);
  };

  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <div className="m-2">
      <div className="space-x-2">
        {menus.map((menu) => (
          <Button
            key={menu.id}
            variant={activeMenuId === menu.id ? "contained" : "outlined"}
            sx={{
              borderColor:
                activeMenuId !== menu.id && isDarkMode ? "#64c3a6" : "#a94c79",
              color:
                activeMenuId === menu.id
                  ? isDarkMode
                    ? "#fefefe"
                    : "#fefefe"
                  : isDarkMode
                    ? "#64c3a6"
                    : "#a94c79",
              backgroundColor:
                activeMenuId === menu.id
                  ? isDarkMode
                    ? "#64c3a6"
                    : "#a94c79"
                  : "transparent",
            }}
            onClick={() => handleMenuClick(menu.id)}
          >
            {menu.name}
          </Button>
        ))}
      </div>
      {menus.map((menu) =>
        activeMenuId === menu.id ? (
          <div key={menu.id} className="m-4 bg-grey-1 p-5">
            <h3 className="text-xl font-medium">{menu.name}</h3>
            {menu.menuItems.map((item) => (
              <MenuItemComponent
                key={item.id}
                item={item}
                addToCart={addToCart}
              />
            ))}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default RestaurantMenuView;
