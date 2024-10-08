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

interface MenuItemProps {
  name: string;
  alternateName: string;
  price: number;
  alcoholPercentage: number;
  menuType: string;
  photo?: string; // Optional prop
  onDelete: () => void;
  onEdit: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  alternateName,
  price,
  alcoholPercentage,
  menuType,
  photo,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation("global");
  const defaultImage =
    menuType === "Alcohol" ? DefaultDrinkItem : DefaultMenuItem;
  const imagePath = photo || defaultImage;
  const alcoholPercentageVisible = menuType === "Alcohol";
  const [confirmationOpen, setConfirmationOpen] = useState(false);

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
    <Card className="m-1 w-64 rounded-lg dark:bg-grey-5 dark:text-grey-1">
      <CardContent className="flex flex-col">
        <img
          src={getImage(imagePath, DefaultPic)}
          alt="MenuItemImage"
          className="mb-2 h-36 w-full rounded-lg"
        />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h2 className="font-bold">{name}</h2>
            {alternateName !== name && (
              <h3 className="font-medium">{alternateName}</h3>
            )}
          </div>
          <div className="flex space-x-1">
            <button className="text-primary" onClick={onEdit}>
              <EditIcon />
            </button>
            <button className="text-primary" onClick={handleDeleteConfirmation}>
              <DeleteIcon />
            </button>
          </div>
        </div>
        <p className="text-sm">{price} PLN</p>
        {alcoholPercentageVisible && (
          <p className="text-xs">
            {t("restaurant-management.menu.menuItemAlcoholPercentage")}:{" "}
            {alcoholPercentage}%
          </p>
        )}
        <ConfirmationDialog
          open={confirmationOpen}
          onClose={handleDeleteCancelled}
        >
        <div className="p-4 flex flex-col justify-between h-[20vh] w-[20vw]">
          <h1>Delete?</h1>
          <p>you wanna delete?</p>
          <div className="flex justify-between">
            <button onClick={handleDeleteConfirmed}>YES</button>
            <button onClick={handleDeleteCancelled}>nono</button>
          </div>
        </div>
        </ConfirmationDialog>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
