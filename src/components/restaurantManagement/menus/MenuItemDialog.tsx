import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchFilesPOST, fetchGET, fetchPOST } from "../../../services/APIconn";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Ingredient, MenuItemType } from "../../../services/types";
import { forEach, initial } from "lodash";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { Field, Form, Formik, FormikValues } from "formik";
import { ArrowDownward } from "@mui/icons-material";

interface MenuItemDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: { [key: string]: string }) => void;
    menuType: string;
    restaurantId: number;
    editedMenuItem?: MenuItemType | null;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});


interface IngredientUsage {
  ingredientId: number,
  amountUsed: number
}


const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  open,
  onClose,
  onSave,
  menuType,
  restaurantId,
  editedMenuItem = null, //??????????? nie wiem o co chodzi, nie dotykam
}) => {
  const [values, setValues] = useState<{ [key: string]: string }>({
    name: "",
    alternateName: "",
    price: "",
    alcoholPercentage: "",
    photo: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (open) {
      if (editedMenuItem) {
        const { name, alternateName, price, alcoholPercentage, photo } =
          editedMenuItem;
        setValues({
          name: name || "",
          alternateName: alternateName || "",
          price: price.toString() || "",
          alcoholPercentage: alcoholPercentage
            ? alcoholPercentage.toString()
            : "",
          photo: "",
        });
        setPhotoFileName(null);
      } else {
        setValues({
          name: "",
          alternateName: "",
          price: "",
          alcoholPercentage: "",
          photo: "",
        });
        setPhotoFileName(null);
      }
    }
  }, [open, editedMenuItem]);

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
      newErrors.price = t(
        "restaurant-management.menu.menuItemPriceMustBeNumber",
      );
    }
    if (isNaN(Number(values.alcoholPercentage))) {
      newErrors.alcoholPercentage = t(
        "restaurant-management.menu.menuItemAlcoholMustBeNumber",
      );
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //=====================================================
  const { t } = useTranslation("global");

  const {menuItemSchema} = useValidationSchemas();

  const initialValues = {
    price: "",
    name: "",
    alternateName: "",
    alcoholPercentage: "",
    photo: ""

  }
  const initialValuesIng = {
    id: "",
    amountUsed: ""
  }
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientUsage[]>([])

  const handleSubmitIng = (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitting(true)
    setSelectedIngredients([...selectedIngredients, {
        ingredientId: values.ingredientId,
        amountUsed: values.amountUsed
    }])
    setSubmitting(false)

    console.log(selectedIngredients)
  }


  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect (()=>{
    const getIngredients = async () => {
      try{
  
        let page=0;
        let totalPages = 1;
        const perPage= 5;
  
        let tmp:Ingredient[] = []
  
        while (page < totalPages){
          const res = await fetchGET(`/restaurants/${restaurantId}/ingredients?page=${page++}&perPage=${perPage}`);
          totalPages=res.totalPages;
          for(const i in res.items)
            tmp.push(res.items[i]);
        }

        setIngredients(tmp);
      } catch (error) {
        console.error("Error fetching ingredients", error);
      }
    }
    getIngredients();
  },[])
  

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if(values.photo)
      try {
      const photoUrl = await fetchFilesPOST("/uploads", values.photo);
      values.photo = photoUrl.fileName;

    } catch (error) {
      console.error("Error uploading photo:", error);
      return;
    }
    try {
      setSubmitting(true);
      const body = JSON.stringify(
        {
          restaurantId: restaurantId,
          price: values.price,
          name: values.name,
          alternateName: values.alternateName,
          alcoholPercentage: values.alcoholPercentage?values.alcoholPercentage:0,
          photo: values.photo,
          ingredients: values.ingridients,
        },
      );
      console.log(body)

      await fetchPOST(
        '/menu-items',
        body,
      );
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    
    <Dialog open={open} onClose={onClose} className="">
      <div className="h-full w-full">
        <DialogTitle>
          {editedMenuItem
            ? t("restaurant-management.menu.editedMenuItem")
            : t("restaurant-management.menu.newMenuItem")}
        </DialogTitle>
        <DialogContent className="w-full h-full">
        <Formik  
          initialValues={initialValues} 
          onSubmit={handleSubmitIng}
        >

          {(formik) => {
              return(
              <Form>
                  <div className="flex justify-center w-full">

                      <Field
                          as="select"
                          id="ingredientId" 
                          name="ingredientId" 
                          className={` [&>*]:label-[20px] w-fit [&>*]:font-mont-md [&>*]:text-[15px] "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                      >
                      {
                          
                          ingredients.map((ingredient) => 
                          <option 
                          value={ingredient.ingredientId}
                          > 
                          {ingredient.publicName}  ({ingredient.unitOfMeasurement}) 
                          </option>)
                      }
                      </Field>
                      <Field 
                          type="number" 
                          id="amountUsed" 
                          name="amountUsed"
                          className="border w-1/4" 
                          variant="standard"

                          as={TextField}
                      />
                      <button
                          type="submit"
                          className="border" 
                          id="addIngridientToMenuItem"
                          disabled={!formik.isValid || !formik.dirty}

                      >
                      add 
                        {/*@todo tlumacz  */}
                      </button> 
                      {/* @todo tłumaczenie */}

                  </div>
              </Form>
              
              )
          }}
        </Formik>
        <div>
          {
            selectedIngredients.map((ingredient) => 
            <span 
              className="border"
            > 
                {ingredient.ingredientId}, {ingredient.amountUsed} ;
                <button onClick={()=>{
                          //@todo usuwanie
                }}> X </button>
            </span>
            )
          }
        </div>
          <Formik
            id="menuitem-formik"
            initialValues={initialValues}
            validationSchema={menuItemSchema}
            onSubmit={onSubmit}
          >
          {(formik) => {
            return(
              <Form>
                <div  
                  id="addmenuitem-form-containter"
                  className="form-container flex h-full flex-col items-center gap-8"
                >
                  <div className="flex w-full flex-col items-center gap-6">
                    
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      helperText={
                        formik.errors.name &&
                        formik.touched.name &&
                        formik.errors.name
                      }
                      label="NAME" //@TODO tłumaczenia
                      variant="standard"
                      className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.name && formik.touched.name) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                      color="primary"
                      as={TextField}
                    />
                    
                    <Field
                      type="text"
                      id="alternateName"
                      name="alternateName"
                      helperText={
                        formik.errors.alternateName &&
                        formik.touched.alternateName &&
                        formik.errors.alternateName
                      }
                      label="NAME TRANSLATION" //@TODO tłumaczenia
                      variant="standard"
                      className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.alternateName && formik.touched.alternateName) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                      color="primary"
                      as={TextField}
                    />
                    <Field
                      type="text"
                      id="price"
                      name="price"
                      helperText={
                        formik.errors.price &&
                        formik.touched.price &&
                        formik.errors.price
                      }
                      label="PRICE" //@todo tłumaczenia
                      variant="standard"
                      className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.price && formik.touched.price) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                      color="primary"
                      as={TextField}
                    />
                    
                  </div>                     
                    
                    {menuType === "Alcohol" && (
                      <Field
                        type="text"
                        id="alcoholPercentage"
                        name="alcoholPercentage"
                        helperText={
                          formik.errors.alcoholPercentage &&
                          formik.touched.alcoholPercentage &&
                          formik.errors.alcoholPercentage
                        }
                        label="%%%%%" //@TODO tłumaczenia
                        variant="standard"
                        className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.alcoholPercentage && formik.touched.alcoholPercentage) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                        color="primary"
                        as={TextField}
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
                      Upload photo
                      {/* @todo tlumaczneie */}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </Button>
                    {photoFileName && (
                      <span className="ml-2 h-min w-min">
                        {t("restaurant-management.menu.selectedFile")}: {photoFileName}
                      </span>
                    )}
                  </div>
                  <DialogActions>
                    <Button 
                      id="addmenuitemsubmit"
                      type="submit"
                      disabled={!formik.isValid}
                      className={`flex h-[50px] w-4/5 cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}  
                    >
                      {t("general.save")}
                    </Button>
                    <Button 
                      className={`flex h-[50px] w-4/5 cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}  
                      onClick={onClose}
                    >
                      {t("general.cancel")}
                    </Button>
                  </DialogActions>
                  </Form>
                  
            )
          }}
          </Formik>
          
      </DialogContent>
      </div>
    </Dialog>

  );
};

export default MenuItemDialog;
