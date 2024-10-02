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
import {
  Box,
  Button,
  Menu,
  Modal,
  TextField,
} from "@mui/material";
import ConfirmationDialog from "../../reusableComponents/ConfirmationDialog";
import { MenuItemType, MenuType } from "../../../services/types";
import { FetchError } from "../../../services/Errors";

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

  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(0);
  

  const [editMenu, setEditMenu] = useState<Menu | null>(null);
  const [editedMenuItem, setEditedMenuItem] = useState<MenuItemType | null>(
    null,
  );

  
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [isEditMenuPopupOpen, setIsEditMenuPopupOpen] = useState(false);
  const [isMenuItemPopupOpen, setIsMenuItemPopupOpen] = useState(false);
  const [isMenuItemEditPopupOpen, setIsMenuItemEditPopupOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const [searchText, setSearchText] = useState<string>("")

  useEffect(() => {
    const fetchMenus = async () => {
      try {

        const menus: MenuType[] = await fetchGET(
          `/restaurants/${activeRestaurantId}/menus`,
        )

        const completeMenus = await Promise.all(
          menus.map(async (menu) => {
            const response = await fetchGET(`/menus/${menu.menuId}`);
            return response;
          })
        );

        setMenus(completeMenus)
      } catch (error) {
        if (error instanceof FetchError) {
          console.log(error.formatErrors())
        } else {
          console.log("Unexpected error")
        }
      }
    };
    fetchMenus();
  }, [isMenuItemPopupOpen]);

 


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
      
    } catch (error) {
      console.error("Error saving new menu:", error);
    }
  };

  const handleEditMenu = () => {
    {
     
      setEditMenu(menus[selectedMenuIndex]);
      setIsEditMenuPopupOpen(true);
    }
  };

  const handleSaveEditedMenu = async (values: { [key: string]: string }) => {
    {
      const body = JSON.stringify({
        name: values.name,
        alternateName: values.alternateName,
        menuType: values.type,
        dateFrom: values.dateFrom,
        dateUntil: values.dateUntil,
      });
      try {
        const menuId = menus[selectedMenuIndex]?.menuId
        const response = await fetchPUT(`/menus/${menuId}`, body);
        console.log("Response:", response);
        setIsEditMenuPopupOpen(false);
       
      } catch (error) {
        console.error("Error while editing category:", error);
      }
    }
  };

  const handleDeleteMenu = async () => {
    try {
      if (menus[selectedMenuIndex]) {
        const menuId = menus[selectedMenuIndex].menuId;
        const response = await fetchDELETE(`/menus/${menuId}`);
      } else {
        console.error("No menu selected to delete");
      }
    } catch (error) {
      console.error("Error while deleting menu:", error);
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

      }
    } catch (error) {
      console.error("Error while saving edited menu item:", error);
    }
  };

  const handleRemoveMenuItem = async (menuItem: MenuItemType) => {

    try {

      const { menuItemId } = menuItem;
      const body = JSON.stringify(
      {
        itemIds: [menuItemId],
      });
      const response = await fetchDELETE(`/menus/${menus[selectedMenuIndex]?.menuId}/items`, body);
      console.log(response);
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error")
      }
    }
  };

  const handleDeletePermanentlyMenuItem = async (menuItem: MenuItemType) => {
    try {

        const { menuItemId } = menuItem;
      
        const response = await fetchDELETE(`/menu-items/${menuItemId}`);
        console.log(response);
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error")
      }
    }
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

  const menuActions = [
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
  

    
    

  return (
    <div className="h-full w-full">
      <div className="bg-grey-1 h-[10%]">
      
        <div className="flex h-full gap-1">
          {(activeRestaurantId !== null)
          && menus.map(
            (menuTab: MenuType) => (
            <button
              key={menuTab.menuId}
              className={` rounded-t-md p-2 h-full w-full  text-lg  ${menuTab.menuId === menus[selectedMenuIndex]?.menuId ? "bg-white  text-primxary dark:text-secondary-2 " : "text-grey-2 bg-grey-0"}`}
              onClick={() =>
                setSelectedMenuIndex(
                  menus.findIndex((menu: MenuType)=>menu.menuId===menuTab.menuId)
                )
              }
            >
              {menuTab.name}
            </button>))
          }
          <button
            className={` rounded-t-md p-2 h-full  w-1/6 text-lg "text-grey-2 bg-grey-0 `}
          >
            
            <MoreActions actions={menuActions} />
            
          </button>
        </div>
    
      </div>
      <div className="h-[95%] w-full flex-col rounded-t-none rounded-lg bg-white ">
      

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {menus[selectedMenuIndex] && (
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
            
          </div>
          <div className="flex-grow">
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
    
                  onChange={(e)=>{
                    setSearchText(e.target.value)
                  }}
                  variant="standard"
                  className="rounded-lg p-1 dark:bg-grey-6 dark:text-white"
                />
              </Box>
          </div>
        </div>

        <div className="m-1">
          {menus[selectedMenuIndex] && (
            <div className=" flex flex-wrap gap-1">
              {menus[selectedMenuIndex].menuItems.filter((menuItem: MenuItemType)=>{
                const nameMatch = menuItem.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
                const priceMatch = menuItem.price
                  .toString()
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
                return nameMatch || priceMatch;
              }).map((menuItem: MenuItemType) => (
                <MenuItem
                  key={menuItem.menuItemId}
                  menuItem={menuItem}
                  menuType={menus[selectedMenuIndex].menuType}
                  onDelete={() => handleRemoveMenuItem(menuItem)}
                  onEdit={() => handleEditMenuItem(menuItem)}
                  onAlt={() => handleDeletePermanentlyMenuItem(menuItem)}
                />
              ))}
            </div>
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
          <div className=" h-[615px] w-[615px] rounded-xl  bg-white p-5">

          <MenuItemDialog 
          
            menu={menus[selectedMenuIndex]}
            activeMenuItems={menus[selectedMenuIndex]?.menuItems}
          
            restaurantId={activeRestaurantId}
          
            onClose={() => setIsMenuItemPopupOpen(false)}

          />
          </div>

        </Modal>
        <Modal
          className="flex items-center justify-center"
          open={isMenuItemEditPopupOpen}

          onClose={() => setIsMenuItemEditPopupOpen(false)}

        >
          <div className=" h-[615px] w-[615px] rounded-xl  bg-white p-5">
          
            <MenuItemDialog
              menu={menus[selectedMenuIndex]}
              
              activeMenuItems={menus[selectedMenuIndex]?.menuItems}

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
