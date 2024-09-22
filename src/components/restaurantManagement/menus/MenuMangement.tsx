import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchDELETE,
  fetchGET,
  fetchPOST,
  fetchPUT,
} from "../../../services/APIconn";

import MoreActions from "../../reusableComponents/MoreActions";
import MenuDialog from "./MenuDialog";
import MenuItemDialog from "./MenuItemDialog";
import MenuItem from "./MenuItem";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  Modal,
  MenuItem as MyMenuItem,
  TextField,
} from "@mui/material";
import MenuOrderBy from "./MenuSortBy";
import ConfirmationDialog from "../../reusableComponents/ConfirmationDialog";
import { MenuItemType, MenuType } from "../../../services/types";

interface MenuManagementProps {
  activeRestaurantId: number;
}

interface Menu {
  menuId: number;
  name: string;
  alternateName: string;
  menuType: string;
  dateFrom: string;
  dateUntil: string | null;
  menuItems: MenuItemType[];
}



const MenuManagement: React.FC<MenuManagementProps> = ({
  activeRestaurantId,
}) => {
  const { t } = useTranslation("global");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuNamesByRestaurant, setmenuNamesByRestaurant] = useState<{
    [key: number]: string[];
  }>({});
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(
    null
  );
  const [editMenu, setEditMenu] = useState<Menu | null>(null);
  const [editedMenuItem, setEditedMenuItem] = useState<MenuItemType | null>(
    null,
  );
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [isEditMenuPopupOpen, setIsEditMenuPopupOpen] = useState(false);
  const [isMenuItemPopupOpen, setIsMenuItemPopupOpen] = useState(false);
  const [isMenuItemEditPopupOpen, setIsMenuItemEditPopupOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  useEffect(() => {
    if (activeRestaurantId !== null) {
      console.log(activeRestaurantId);
      fetchMenus(activeRestaurantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRestaurantId]);

  useEffect(() => {
    const isMenuFetched =
      selectedMenuIndex !== null &&
      menus.length > selectedMenuIndex &&
      menus[selectedMenuIndex].menuItems.length > 0;

    if (!isMenuFetched) {
      fetchMenuIemsForSelectedMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, selectedMenuIndex]);

  const fetchMenuIemsForSelectedMenu = async () => {
    if (selectedMenuIndex !== null && menus.length > selectedMenuIndex) {
      const menuId = menus[selectedMenuIndex].menuId;
      try {
        const menuData = await fetchGET(`/menus/${menuId}`);
        console.log("Menu items for selected menu:", menuData);
        if (!menuData.menuItems || menuData.menuItems.length === 0) {
          return;
        }
        setMenus((prevMenus) => {
          const updatedMenus = [...prevMenus];
          updatedMenus[selectedMenuIndex] = {
            ...updatedMenus[selectedMenuIndex],
            menuItems: menuData.menuItems || [],
          };
          return updatedMenus;
        });
      } catch (error) {
        console.error("Error fetching menu items for selected menu:", error);
      }
    }
  };

  const fetchMenus = async (restaurantId: number): Promise<Menu[]> => {
    try {
      const menusData: Menu[] = await fetchGET(
        `/my-restaurants/${restaurantId}/menus`,
      );
      console.log("Menus data:", menusData);
      const validatedMenusData = menusData.map((menu) => ({
        ...menu,
        menuItems: menu.menuItems || [], // Jeśli brakuje menuItems, ustaw na pustą tablicę
      }));
      const allMenuNames = validatedMenusData.map((menu) => menu.name);
      setMenus(validatedMenusData);
      setmenuNamesByRestaurant({ [activeRestaurantId || 0]: allMenuNames });
      return validatedMenusData;
    } catch (error) {
      console.error("Error fetching menus:", error);
      return [];
    }
  };

  const handleSaveNewMenu = async (values: { [key: string]: string }) => {
    console.log("New menu values:", values);

    const body = JSON.stringify({
      restaurantId: activeRestaurantId,
      name: values.name,
      alternateName: values.alternateName,
      menuType: values.type,
      dateFrom: values.dateFrom,
      dateUntil: values.dateUntil,
    });

    try {
      const response = await fetchPOST("/menus", body);
      console.log("Response:", response);
      setIsMenuPopupOpen(false);
      if (activeRestaurantId !== null) {
        fetchMenus(activeRestaurantId);
      }
    } catch (error) {
      console.error("Error saving new menu:", error);
    }
  };

  const handleEditMenu = () => {
    if (
      selectedMenuIndex !== null &&
      menuNamesByRestaurant[activeRestaurantId || 0]
    ) {
      const selectedMenu = menus[selectedMenuIndex];
      setEditMenu(selectedMenu);
      setIsEditMenuPopupOpen(true);
    }
  };

  const handleSaveEditedMenu = async (values: { [key: string]: string }) => {
    if (
      selectedMenuIndex !== null &&
      menuNamesByRestaurant[activeRestaurantId || 0]
    ) {
      const body = JSON.stringify({
        name: values.name,
        alternateName: values.alternateName,
        menuType: values.type,
        dateFrom: values.dateFrom,
        dateUntil: values.dateUntil,
      });
      try {
        const menuId = menus[selectedMenuIndex].menuId;
        const response = await fetchPUT(`/menus/${menuId}`, body);
        console.log("Response:", response);
        setIsEditMenuPopupOpen(false);
        if (activeRestaurantId !== null) {
          fetchMenus(activeRestaurantId);
        }
      } catch (error) {
        console.error("Error while editing category:", error);
      }
    }
  };

  const handleDeleteMenu = async () => {
    try {
      if (selectedMenuIndex !== null && menus[selectedMenuIndex]) {
        const menuId = menus[selectedMenuIndex].menuId;
        const response = await fetchDELETE(`/menus/${menuId}`);
        setSelectedMenuIndex(null);
      } else {
        console.error("No menu selected to delete");
      }
    } catch (error) {
      console.error("Error while deleting menu:", error);
    }
    if (activeRestaurantId !== null) {
      fetchMenus(activeRestaurantId);
    }
  };

  const handleSaveNewMenuItem = async (values: { [key: string]: string }) => {
    try {
      console.log(activeRestaurantId);

      const body = JSON.stringify({
        restaurantId: activeRestaurantId,
        name: values.name,
        alternateName: values.alternateName,
        price: values.price,
        alcoholPercentage: values.alcoholPercentage || null,
        photofileName: values.photo, // Ensure this is set correctly
      });
      const response = await fetchPOST("/menu-items", body);
      if (selectedMenuIndex !== null && menus[selectedMenuIndex]) {
        const menuItemId = response.menuItemId;
        const menuId = menus[selectedMenuIndex].menuId;
        const response2 = await fetchPOST(
          `/menus/${menuId}/items`,
          JSON.stringify({ itemIds: [menuItemId] }),
        );
        console.log(response2);
        setIsMenuItemPopupOpen(false);
        fetchMenuIemsForSelectedMenu();
      }
    } catch (error) {
      console.error("error while posting new menu item:", error);
    }
  };

  const handleEditMenuItem = (menuItem: MenuItemType) => {
    setEditedMenuItem(menuItem);
    setIsMenuItemEditPopupOpen(true);
  };

  const handleSaveEditedMenuItem = async (values: {
    [key: string]: string;
  }) => {
    try {
      if (editedMenuItem) {
        const { menuItemId } = editedMenuItem;
        const photoFileName = values.photo.startsWith("/uploads/")
          ? values.photo.slice(9)
          : values.photo;
        const body = JSON.stringify({
          name: values.name,
          alternateName: values.alternateName,
          price: values.price,
          alcoholPercentage: values.alcoholPercentage || null,
          photofileName: photoFileName,
        });
        console.log(body);
        const response = await fetchPUT(`/menu-items/${menuItemId}`, body);
        console.log(response);
        setIsMenuItemEditPopupOpen(false);

        fetchMenuIemsForSelectedMenu();
      }
    } catch (error) {
      console.error("Error while saving edited menu item:", error);
    }
  };

  const handleDeleteMenuItem = async (menuItem: MenuItemType) => {
    try {
      const { menuItemId } = menuItem;
      const response = await fetchDELETE(`/menu-items/${menuItemId}`);
      console.log(response);
    } catch (error) {
      console.error("Error while deleting menu item:", error);
    }
    fetchMenuIemsForSelectedMenu();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(event.target.value);
  };

  const editedMenu = editMenu
    ? {
        name: editMenu.name,
        alternateName: editMenu.alternateName,
        type: editMenu.menuType,
        dateFrom: editMenu.dateFrom,
        dateUntil: editMenu.dateUntil || "",
      }
    : null;

  const actions = [
    {
      icon: <AddIcon />,
      name: "Add menu",
      onClick: () => setIsMenuPopupOpen(true),
    },
    { icon: <EditIcon />, name: "Edit menu", onClick: handleEditMenu },
    {
      icon: <DeleteIcon />,
      name: "Delete menu",
      onClick: () => setOpenConfirmation(true),
    },
  ];

  const filteredMenuItems =
    selectedMenuIndex !== null
      ? menus[selectedMenuIndex]?.menuItems.filter((menuItem: MenuItemType) => {
          const nameMatch = menuItem.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
          const priceMatch = menuItem.price
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase());
          return nameMatch || priceMatch;
        })
      : [];

  const sortMenuItems = (
    sortFunction: (a: MenuItemType, b: MenuItemType) => number,
  ) => {
    if (selectedMenuIndex !== null) {
      const sortedMenuItems = [...menus[selectedMenuIndex].menuItems].sort(
        sortFunction,
      );
      setMenus((prevMenus) => {
        const updatedMenus = [...prevMenus];
        updatedMenus[selectedMenuIndex] = {
          ...updatedMenus[selectedMenuIndex],
          menuItems: sortedMenuItems,
        };
        return updatedMenus;
      });
      handleSortClose();
    }
  };

  const handleSortAlphabeticallyAsc = () => {
    sortMenuItems((a: MenuItemType, b: MenuItemType) =>
      a.name.localeCompare(b.name),
    );
  };
  const handleSortAlphabeticallyDesc = () => {
    sortMenuItems((a: MenuItemType, b: MenuItemType) =>
      b.name.localeCompare(a.name),
    );
  };

  const handleSortPriceAsc = () => {
    sortMenuItems((a: MenuItemType, b: MenuItemType) => a.price - b.price);
  };

  const handleSortPriceDesc = () => {
    sortMenuItems((a: MenuItemType, b: MenuItemType) => b.price - a.price);
  };

  const handleSortAlcoholAsc = () => {
    sortMenuItems(
      (a: MenuItemType, b: MenuItemType) =>
        (a.alcoholPercentage ?? 0) - (b.alcoholPercentage ?? 0),
    );
  };

  const handleSortAlcoholDesc = () => {
    sortMenuItems(
      (a: MenuItemType, b: MenuItemType) =>
        (b.alcoholPercentage ?? 0) - (a.alcoholPercentage ?? 0),
    );
  };

  const handleClearSort = () => {
    fetchMenuIemsForSelectedMenu();
  };

  return (
    <div className="h-full w-full">
      <div className="bg-grey-1 h-[5%]">
        {/* {selectedMenuIndex === null && (
          <div className="flex justify-start">
            <IconButton onClick={() => setIsMenuPopupOpen(true)}>
              <AddIcon className="text-secondary-2" />
              <span className="ml-1 text-black dark:text-white">ADD MENU</span>
            </IconButton>
          </div>
        )} */}
        <div className="flex h-full justify-start gap-1">
          {activeRestaurantId !== null && menuNamesByRestaurant[activeRestaurantId]
          ? menuNamesByRestaurant[activeRestaurantId].map(
            (name: string, index: number) => (
            <button
              key={index}
              className={` rounded-t-md p-2 flex text-xl ${index === selectedMenuIndex ? "bg-white  text-primxary dark:text-secondary-2 " : "text-grey-2 bg-grey-0"}`}
              onClick={() =>
                setSelectedMenuIndex(
                  index === selectedMenuIndex ? null : index,
                )
              }
            >
              {name}
            </button>))
          : null
          }
          <button
            className={` rounded-t-md p-2 flex text-2xl font-bold self-end h-full "text-grey-2 bg-grey-0 `}
            onClick={handleMenuOpen}
            disabled={selectedMenuIndex === null}
          >
            
            <MoreActions actions={actions} />
            
          </button>
        </div>
    
      </div>
      <div className="h-[95%] w-full flex-col rounded-tl-none rounded-lg bg-white ">
      

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedMenuIndex !== null && (
              <Button
                startIcon={<AddIcon className="text-secondary-2" />}
                onClick={() => {
                  setIsMenuItemPopupOpen(true);
                }}
              >
                <span className="ml-1 text-black dark:text-white">
                  ADD MENU ITEM
                {/* @todo t */}
                </span>
              </Button>
            )}
            {selectedMenuIndex !== null && (
              <MenuOrderBy
                filterAnchorEl={filterAnchorEl}
                handleSortOpen={handleSortOpen}
                handleSortClose={handleSortClose}
                handleSortAlphabeticallyAsc={handleSortAlphabeticallyAsc}
                handleSortAlphabeticallyDesc={handleSortAlphabeticallyDesc}
                handleSortPriceAsc={handleSortPriceAsc}
                handleSortPriceDesc={handleSortPriceDesc}
                handleSortAlcoholAsc={handleSortAlcoholAsc}
                handleSortAlcoholDesc={handleSortAlcoholDesc}
                handleClearSort={handleClearSort}
              />
            )}
          </div>
          <div className="flex-grow">
            {selectedMenuIndex !== null && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  type="text"
                  label={t("general.search")}
                  onChange={handleSearchInputChange}
                  variant="standard"
                  className="rounded-lg p-1 dark:bg-grey-6 dark:text-white"
                />
              </Box>
            )}
          </div>
        </div>

        <div className="m-1 flex flex-wrap">
          {selectedMenuIndex !== null && menus[selectedMenuIndex] && (
            <>
              {filteredMenuItems.map((menuItem: MenuItemType) => (
                <MenuItem
                  key={menuItem.menuItemId}
                  menuItem={menuItem}
                  menuType={menus[selectedMenuIndex].menuType}
                  onDelete={() => handleDeleteMenuItem(menuItem)}
                  onEdit={() => handleEditMenuItem(menuItem)}
                />
              ))}
            </>
          )}
        </div>
        <MenuDialog
          open={isMenuPopupOpen}
          onClose={() => setIsMenuPopupOpen(false)}
          onSave={handleSaveNewMenu}
        />
        <MenuDialog
          open={isEditMenuPopupOpen}
          onClose={() => setIsEditMenuPopupOpen(false)}
          onSave={handleSaveEditedMenu}
          editedMenu={editedMenu}
        />
        <Modal
          className="flex items-center justify-center"
          open={isMenuItemPopupOpen}
          onClose={() => setIsMenuItemPopupOpen(false)}
        >
          <div className=" h-[510px] w-[700px] rounded-xl  bg-white p-5">

          <MenuItemDialog 
          
          
            restaurantId={activeRestaurantId}
            onClose={() => setIsMenuItemPopupOpen(false)}
            menu={menus[selectedMenuIndex?selectedMenuIndex:0]}

          />
          </div>

        </Modal>
        <Modal
          className="flex items-center justify-center"
          open={isMenuItemEditPopupOpen}

          onClose={() => setIsMenuItemEditPopupOpen(false)}

        >
          <div>
            <MenuItemDialog
              menu={menus[selectedMenuIndex?selectedMenuIndex:0]}

              restaurantId={activeRestaurantId}
              editedMenuItem={editedMenuItem}
              onClose={() => setIsMenuItemEditPopupOpen(false)}

            />

          </div>
        </Modal>
        <ConfirmationDialog
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleDeleteMenu}
          confirmationText={`Are you sure you want to delete this menu?`}
        />
      </div>
    </div>
  
  );
};

export default MenuManagement;
