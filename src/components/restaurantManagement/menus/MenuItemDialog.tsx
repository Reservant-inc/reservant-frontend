import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchFilesPOST } from "../../../services/APIconn";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    const [photoFileName, setPhotoFileName] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (open) {
            if (editedMenuItem) {
                const { name, alternateName, price, alcoholPercentage, photo } = editedMenuItem;
                setValues({
                    name: name || "",
                    alternateName: alternateName || "",
                    price: price.toString() || "",
                    alcoholPercentage: alcoholPercentage ? alcoholPercentage.toString() : "",
                    photo: photo || ""
                });
                setPhotoFileName(photo || null); // Ustawienie nazwy pliku tylko w trybie edycji
            } else {
                setValues({
                    name: "",
                    alternateName: "",
                    price: "",
                    alcoholPercentage: "",
                    photo: ""
                });
                setPhotoFileName(null); // Usunięcie nazwy pliku w trybie dodawania nowego elementu
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
            setPhotoFileName(e.target.files[0].name);
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!values.name) {
            newErrors.name = t("restaurant-management.menu.menuItemNameRequired");
        }
        if (!values.price) {
            newErrors.price = t("restaurant-management.menu.menuItemPriceRequired");
        } else if (isNaN(Number(values.price))) {
            newErrors.price = t("restaurant-management.menu.menuItemPriceMustBeNumber");
        }
        if (isNaN(Number(values.alcoholPercentage))) {
            newErrors.alcoholPercentage = t("restaurant-management.menu.menuItemAlcoholMustBeNumber");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        if (photoFile && (!editedMenuItem || !editedMenuItem.photo)) {
            try {
                const photoUrl = await fetchFilesPOST("/uploads", photoFile); 
                const updatedValues = {
                    ...values,
                    photo: photoUrl.fileName
                };
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

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {editedMenuItem ? t("restaurant-management.menu.editedMenuItem") : t("restaurant-management.menu.newMenuItem")}
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="name"
                    label={t("restaurant-management.menu.menuItemName")}
                    fullWidth
                    value={values.name}
                    onChange={handleChange}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    required
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
                    required
                    error={!!errors.price}
                    helperText={errors.price}
                />
                {menuType === "Alcohol" && (
                    <TextField
                        required
                        margin="dense"
                        name="alcoholPercentage"
                        label={t("restaurant-management.menu.menuItemAlcoholPercentage")}
                        fullWidth
                        value={values.alcoholPercentage}
                        onChange={handleChange}
                        error={!!errors.alcoholPercentage}
                        helperText={errors.alcoholPercentage}
                    />
                )}
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    className="bg-primary"
                    >
                    Upload file
                    <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                </Button>
                {photoFileName && (
                    <span className="ml-2">{t("restaurant-management.menu.selectedFile")}: {photoFileName}</span>
                )}
            </DialogContent>
            <DialogActions>
                <Button className="text-primary" onClick={onClose}>{t("general.cancel")}</Button>
                <Button onClick={handleSave} className="text-primary">{t("general.save")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MenuItemDialog;
