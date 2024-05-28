import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchFilesPOST } from "../../../services/APIconn";

interface MenuItemData {
    menuItemId: number;
    name: string;
    alternateName: string;
    price: number;
    alcoholPercentage: number;
    photo: string;
}

interface MenuItemDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: { [key: string]: string }) => void;
    menuType: string;
    editedMenuItem?: MenuItemData | null;
}


const MenuItemDialog: React.FC<MenuItemDialogProps> = ({ open, onClose, onSave, menuType, editedMenuItem = null }) => {
    const { t } = useTranslation("global");
    const [values, setValues] = useState<{ [key: string]: string }>({
        name: "",
        alternateName: "",
        price: "",
        alcoholPercentage: "",
        photo: ""
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    useEffect(() => {
        if (open) {
            console.log(editedMenuItem)
            if (editedMenuItem) {
                const { name, alternateName, price, alcoholPercentage, photo } = editedMenuItem;
                setValues({
                    name: name || "",
                    alternateName: alternateName || "",
                    price: price.toString() || "",
                    alcoholPercentage: alcoholPercentage ? alcoholPercentage.toString() : "",
                    photo: photo || ""
                });
            } else {
                setValues({
                    name: "",
                    alternateName: "",
                    price: "",
                    alcoholPercentage: "",
                    photo: ""
                });
            }
        }
    }, [open, editedMenuItem]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPhotoFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (photoFile && (!editedMenuItem || !editedMenuItem.photo)) {
            try {
                const photoUrl = await fetchFilesPOST("/uploads", photoFile); 
                const updatedValues = {
                    ...values,
                    photo: photoUrl.fileName
                };
                console.log("wysłane zdjęcie")
                onSave(updatedValues);
                onClose();
            } catch (error) {
                console.error("Error uploading photo:", error);
                return;
            }
        } else {
            
            onSave(values);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {editedMenuItem ? t("restaurant-management.menu.editedMenuItem") : t("restaurant-management.menu.newMenuItem")}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label={t("restaurant-management.menu.menuItemName")}
                    fullWidth
                    value={values.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="alternateName"
                    label={t("restaurant-management.menu.alternateName")}
                    fullWidth
                    value={values.alternateName}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="price"
                    label={t("restaurant-management.menu.menuItemPrice")}
                    fullWidth
                    value={values.price}
                    onChange={handleChange}
                />
                {menuType === "Alcohol" && (
                    <TextField
                        margin="dense"
                        name="alcoholPercentage"
                        label={t("restaurant-management.menu.menuItemAlcoholPercentage")}
                        fullWidth
                        value={values.alcoholPercentage}
                        onChange={handleChange}
                    />
                )}
                <input
                    accept="image/*"
                    type="file"
                    onChange={handlePhotoChange}
                    className="mt-2"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("general.cancel")}</Button>
                <Button onClick={handleSave} color="primary">{t("general.save")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MenuItemDialog;
