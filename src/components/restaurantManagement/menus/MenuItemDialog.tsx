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
import { CloseSharp, Cancel } from "@mui/icons-material";

interface MenuItemDialogProps {
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
  ingredientId: string,
  amountUsed: number
}


const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
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
  }, [ editedMenuItem]);

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
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const findIngDetails= (ingredient: IngredientUsage) => {
    const res = (ingredients.find((e)=>e.ingredientId==ingredient.ingredientId))
    return res;
  }
  

  return (
    
    <div className="  flex-col ">
      <div className="h-full w-full">
        <h1 >
          {editedMenuItem
            ? t("restaurant-management.menu.editedMenuItem")
            : t("restaurant-management.menu.newMenuItem")}
        </h1>
        <div className="w-full h-full">
        <div className="flex-col flex gap-2">
        <Formik  
          initialValues={initialValues} 
          onSubmit={handleSubmitIng}
        >

          {(formik) => {
              return(
              <Form>
                  <div className=" align-center justify-center w-full flex ">

                      <Field
                          as="select"
                          id="ingredientId" 
                          name="ingredientId" 
                          className={""}
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
                          type="text" 
                          id="amountUsed" 
                          name="amountUsed"
                          className="border w-1/5  text-justify " 
                          variant="standard"
                          label="amount"
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
        <div className="border h-36 rounded-lg overflow-y-auto ">

        <div
          className="flex  p-1  gap-1 flex-wrap  "  
        >
          {
            selectedIngredients.map((ingredient) => 
            <span 
              className="border h-fit flex  rounded-lg"
            > 
                {findIngDetails(ingredient)?.publicName}: {ingredient.amountUsed} {findIngDetails(ingredient)?.unitOfMeasurement}
                <button 
                className=" "
                onClick={()=>{
                  setSelectedIngredients(selectedIngredients.filter((ingredientToRemove)=>{
                    return ingredientToRemove.ingredientId!==ingredient.ingredientId
                  }))
                }}> <CloseSharp/> </button>
            </span>
            )
          }
        </div>
        </div>

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
                      color="primary"
                      className="border w-1/5  text-justify " 

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
                      color="primary"
                      className="border w-1/5  text-justify " 

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
                      color="primary"
                      className="border w-full  text-justify " 
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
                        color="primary"
                        className="border w-1/5  text-justify " 

                      />
                    )}
                    <button
                      role={undefined}
                      className="flex gap-1 p-2 bg-primary text-white"
                    >
                      <>
                      <CloudUploadIcon/>
                      Upload photo
                      {/* @todo tlumaczneie */}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        />
                      
                      </>
                    </button>
                    {photoFileName && (
                      <span className="ml-2 h-min w-min">
                        {t("restaurant-management.menu.selectedFile")}: {photoFileName}
                      </span>
                    )}
                  </div>
                  <div>
                    <button 
                      id="addmenuitemsubmit"
                      type="submit"
                      disabled={!formik.isValid}
                      className={`flex h-[50px] w-4/5 cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}  
                    >
                      {t("general.save")}
                    </button>
                    <button 
                      className={`flex h-[50px] w-4/5 cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}  
                    >
                      {t("general.cancel")}
                    </button>
                  </div>
                  </Form>
                  
            )
          }}
          </Formik>
          
      </div>
      </div>
    </div>

  );
};

export default MenuItemDialog;
