import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DefaultMenuItem from "../../../assets/images/defaultMenuItemImage.png";
import DefaultDrinkItem from "../../../assets/images/defaultDrinkItemImage.png";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../../reusableComponents/ConfirmationDialog";
import { getImage } from "../../../services/APIconn";
import DefaultPic from "../../../assets/images/no-image.png"
import { MenuItemType } from "../../../services/types";

interface MenuItemProps {
  menuType: string
  menuItem: MenuItemType
  onDelete: Function;
  onEdit?: Function;
}

const MenuItem: React.FC<MenuItemProps> = ({
  menuItem,
  menuType,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation("global");
  const defaultImage =
  menuType === "Alcohol" ? DefaultDrinkItem : DefaultMenuItem;
  const imagePath = menuItem.photo || defaultImage;
  const alcoholPercentageVisible = menuType === "Alcohol";
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);

  const handleDeleteConfirmation = () => {
    setConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    onDelete();
    setConfirmationOpen(false);
  };

  const handleDeleteCancelled = () => {
    setConfirmationOpen(false);
  };

  return (
    <Card className="m-1  rounded-lg dark:bg-grey-5 dark:text-grey-1">
      <CardContent className="flex flex-col">
        <img
          src={getImage(imagePath, DefaultPic)}
          alt="MenuItemImage"
          className="mb-2 h-36 w-full rounded-lg"
        />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h2 className="font-bold">{menuItem.name}</h2>
            {menuItem.alternateName !== menuItem.name && (
              <h3 className="font-medium">{menuItem.alternateName}</h3>
            )}
          </div>
          <div className="flex space-x-1">
            {onEdit &&
            <button className="text-primary" onClick={()=>onEdit()}>
              <EditIcon />
            </button>}
            <button className="text-primary" onClick={handleDeleteConfirmation}>
              <DeleteIcon />
            </button>
          </div>
        </div>
        <p className="text-sm">{menuItem.price} PLN</p>
        {alcoholPercentageVisible && (
          <p className="text-xs">
            {t("restaurant-management.menu.menuItemAlcoholPercentage")}:{" "}
            {menuItem.alcoholPercentage}%
          </p>
        )}
        <ConfirmationDialog
          open={confirmationOpen}
          onClose={handleDeleteCancelled}
          onConfirm={handleDeleteConfirmed}
          confirmationText={`Are you sure you want to delete ${menuItem.name}?`}
        />
      </CardContent>
    </Card>
  );
};

export default MenuItem;
