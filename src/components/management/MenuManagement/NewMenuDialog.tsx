import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface NewMenuDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: { [key: string]: string }) => void;
    editedMenu?: { [key: string]: string } | null; // Dodany props dla edytowanego menu
}

const NewMenuDialog: React.FC<NewMenuDialogProps> = ({ open, onClose, onSave, editedMenu = null }) => {
    const { t } = useTranslation("global");
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

    const handleSave = () => {
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
                    margin="dense"
                    name="name"
                    label={t("restaurant-management.menu.name")}
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
                    name="type"
                    label={t("restaurant-management.menu.type")}
                    fullWidth
                    value={values.type}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="dateFrom"
                    label={t("restaurant-management.menu.dateFrom")}
                    fullWidth
                    value={values.dateFrom}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="dateUntil"
                    label={t("restaurant-management.menu.dateUntil")}
                    fullWidth
                    value={values.dateUntil}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("general.cancel")}</Button>
                <Button onClick={handleSave} color="primary">{t("general.save")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewMenuDialog;
