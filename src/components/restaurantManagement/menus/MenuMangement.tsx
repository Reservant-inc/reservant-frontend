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
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0); 
  const [searchText, setSearchText] = useState<string>("");
  
  const [isNewMenuItemOpen, setIsNewMenuItemOpen] = useState(false);
  const [menuItemToEdit, setMenuItemToEdit] = useState<MenuItemType | null>(null);

  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);

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
  }, [isNewMenuItemOpen, isDeleteMenuOpen]);

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
      setIsNewMenuOpen(false);
      
    } catch (error) {
      console.error("Error saving new menu:", error);
    }
  };


  const handleDeleteMenu = async () => {
    try {
      if (menus[activeMenuIndex]) {
        const menuId = menus[activeMenuIndex].menuId; 
        const response = await fetchDELETE(`/menus/${menuId}`);
        setIsDeleteMenuOpen(false)
      }
    }catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error")
      }
    };
  }

  const handleRemoveMenuItem = async (menuItem: MenuItemType) => {
    try {
      const { menuItemId } = menuItem;
      const body = JSON.stringify(
      {
        itemIds: [menuItemId],
      });
      const response = await fetchDELETE(`/menus/${menus[activeMenuIndex]?.menuId}/items`, body);
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

  return (
    <div className="h-full w-full">
      <div className="bg-grey-1 h-[10%]">
      
        <div className="flex h-full gap-1">
          {(activeRestaurantId !== null)
          && menus.map(
            (menuTab: MenuType) => (
            <button
              key={menuTab.menuId}
              className={` rounded-t-md p-2 h-full w-full  text-lg  ${menuTab.menuId === menus[activeMenuIndex]?.menuId ? "bg-white  text-primxary dark:text-secondary-2 " : "text-grey-2 bg-grey-0"}`}
              onClick={() =>
                setActiveMenuIndex(
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
            
            <MoreActions actions={[
              {
                icon: <AddIcon />,
                name: "Add menu",
                onClick: () => setIsNewMenuOpen(true),
              },
              { 
                icon: <EditIcon />,
                name: "Edit menu",
                onClick: () => setIsEditMenuOpen(true),
              },
              {
                icon: <DeleteIcon />,
                name: "Delete menu",
                onClick: () => setIsDeleteMenuOpen(true),
              },
            ]}/>
            
          </button>
        </div>
    
      </div>
      <div className="h-[95%] w-full flex-col rounded-t-none rounded-lg bg-white ">
      

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {menus[activeMenuIndex] && (
              <Button
                startIcon={<AddIcon className="text-secondary-2" />}
                onClick={() => {
                  setIsNewMenuItemOpen(true);
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
          {menus[activeMenuIndex] && (
            <div className=" flex flex-wrap gap-1">
              {menus[activeMenuIndex].menuItems.filter((menuItem: MenuItemType)=>{
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
                  menuType={menus[activeMenuIndex].menuType}
                  onEdit={() => {
                    setMenuItemToEdit(menuItem);
                  }}
                  onDelete={() => handleRemoveMenuItem(menuItem)}
                  onAlt={() => handleDeletePermanentlyMenuItem(menuItem)}
                />
              ))}
            </div>
          )}
        </div>
        
        <Modal
          className="flex items-center justify-center"
          open={isNewMenuItemOpen}
          onClose={() => setIsNewMenuItemOpen(false)}
        >
          <div className=" h-[615px] w-[615px] rounded-xl  bg-white p-5">

          <MenuItemDialog 
          
            menu={menus[activeMenuIndex]}
            activeMenuItems={menus[activeMenuIndex]?.menuItems}
          
            restaurantId={activeRestaurantId}
          
            onClose={() => setIsNewMenuItemOpen(false)}

          />
          </div>

        </Modal>
        <Modal
          className="flex items-center justify-center"
          open={menuItemToEdit!==null}

          onClose={() => setMenuItemToEdit(null)}

        >
          <div className=" h-[615px] w-[615px] rounded-xl  bg-white p-5">
          
            <MenuItemDialog
              menu={menus[activeMenuIndex]}
              
              activeMenuItems={menus[activeMenuIndex]?.menuItems}

              restaurantId={activeRestaurantId}
              menuItemToEdit={menuItemToEdit}
              onClose={() => setMenuItemToEdit(null)}

            />

          </div>
        </Modal>
        <ConfirmationDialog
          open={isDeleteMenuOpen}
          onClose={() => setIsDeleteMenuOpen(false)}
          onConfirm={handleDeleteMenu}
          confirmationText={`Are you sure you want to delete this menu?`} //@todo t
        />
      </div>
    </div>
  
  );
};

export default MenuManagement;
