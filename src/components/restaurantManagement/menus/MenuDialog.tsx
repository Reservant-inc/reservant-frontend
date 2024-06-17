import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';


interface MenuDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: { [key: string]: string }) => void;
    editedMenu?: { [key: string]: string } | null; // Dodany props dla edytowanego menu
}

const MenuDialog: React.FC<MenuDialogProps> = ({ open, onClose, onSave, editedMenu = null }) => {
    const { t } = useTranslation("global");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [values, setValues] = useState<{ [key: string]: string }>({
        name: "",
        alternateName: "",
        type: "",
        dateFrom: "",
        dateUntil: ""
    });

    useEffect(() => {
        if (open) {
            if (editedMenu) {
                setValues(editedMenu); // Ustaw wartości dla edytowanego menu
            } else {
                setValues({
                    name: "",
                    alternateName: "",
                    type: "",
                    dateFrom: "",
                    dateUntil: ""
                });
            }
        }
    }, [open, editedMenu]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!values.name) {
            newErrors.name = t("restaurant-management.menu.menuItemNameRequired");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) {
            return;
        }
        validate();
        onSave(values);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {editedMenu ? t("restaurant-management.menu.editedMenu") : t("restaurant-management.menu.newMenu")}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    name="name"
                    label={t("restaurant-management.menu.name")}
                    fullWidth
                    value={values.name}
                    onChange={handleChange}
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
                    required
                    margin="dense"
                    name="type"
                    label={t("restaurant-management.menu.type")}
                    fullWidth
                    value={values.type}
                    onChange={handleChange}
                    select
                    error={!!errors.type}
                    helperText={errors.type}
                >
                    <MenuItem value="Food">{t("restaurant-management.menu.typeFood")}</MenuItem>
                    <MenuItem value="Alcohol">{t("restaurant-management.menu.typeAlcohol")}</MenuItem>
                    <MenuItem value="Drink">{t("restaurant-management.menu.typeDrink")}</MenuItem>
                    <MenuItem value="Dessert">{t("restaurant-management.menu.typeDessert")}</MenuItem>
                </TextField>
                <TextField
                    required
                    margin="dense"
                    name="dateFrom"
                    label={t("restaurant-management.menu.dateFrom")}
                    fullWidth
                    value={values.dateFrom}
                    onChange={handleChange}
                />
                <TextField
                    required
                    margin="dense"
                    name="dateUntil"
                    label={t("restaurant-management.menu.dateUntil")}
                    fullWidth
                    value={values.dateUntil}
                    onChange={handleChange}
                />
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateRangePicker']}>
                    <DateRangePicker
                        label={t("restaurant-management.menu.dateRange")}
                        value={[values.dateFrom, values.dateUntil]}
                        onChange={(newValue) => {
                            setValues({
                                ...values,
                                dateFrom: newValue[0] || '', 
                                dateUntil: newValue[1] || '' 
                            });
                        }}
                    />
                    </DemoContainer>
                </LocalizationProvider> */}
            </DialogContent>
            <DialogActions>
                <Button className="text-primary" onClick={onClose}>{t("general.cancel")}</Button>
                <Button onClick={handleSave} className="text-primary">{t("general.save")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MenuDialog;
