import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  styled,
  FormLabel,
  Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchFilesPOST, fetchGET, fetchPOST } from "../../../services/APIconn";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Ingredient, MenuItemType } from "../../../services/types";
import { forEach, initial } from "lodash";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { Field, Form, Formik, FormikValues } from "formik";
import { CloseSharp, Cancel, ArrowRight, ArrowForward, ArrowForwardIos } from "@mui/icons-material";
import { Label } from "leaflet";

interface MenuItemDialogProps {
    menuType: string;
    restaurantId: number;
    editedMenuItem?: MenuItemType | null;
    onClose: Function
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
  onClose,
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
    
    <div className="w-full h-full">
      <span className="flex w-full mb-4 pb-2 border-b justify-between">

        <h1 className="text-lg ">
            {editedMenuItem
              ? t("restaurant-management.menu.editedMenuItem")
              : t("restaurant-management.menu.newMenuItem")}
        </h1>

        <button onClick={()=>onClose()} className="hover:text-error">
          <CloseSharp/>
        </button>

      </span>
      <div className="flex w-full h-[90%] gap-4">
        <div className="flex w-[60%] flex-col gap-2">
          <Formik  
            initialValues={initialValuesIng} 
            onSubmit={handleSubmitIng}
          >

            {(formik) => {
              return(
                <Form>
                  <div className="flex gap-2">
                    <Field
                      as={"select"}
                      id="ingredientId" 
                      name="ingredientId" 
                      label="Ingredient"
                      className="w-[65%] border-0 border-b"
                    >
                      <option value="" id="ingredientSelector-option-default">Select an ingredient</option>
                        {/* @todo tlumaczenie  */}
                        {
                              
                          ingredients.map((ingredient) => 
                          <option value={ingredient.ingredientId}> 
                            {ingredient.publicName}  ({ingredient.unitOfMeasurement}) 
                          </option>)
                        }
                    </Field>
                    <div className="flex w-[35%]">
                      <Field 
                        type="text" 
                        id="amountUsed" 
                        name="amountUsed"
                        className={` w-full  ${!(formik.errors.amountUsed && formik.touched.amountUsed) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-primary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
                        variant="standard"
                        label="Amount"
                        as={TextField}
                        // @todo tlumacz
                      />
                      <button
                        type="submit"
                        className={` bg-grey-0 border-b  text-grey-black  ${formik.isValid&&formik.dirty?` hover:text-primary`:``}  ` }
                        id="addIngridientToMenuItem"
                        disabled={!formik.isValid || !formik.dirty}
                      >
                        <ArrowForwardIos/> 
                      </button> 
                    </div>
                  </div>
                </Form>
              )
            }}
          </Formik>

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
                        label="Name" //@TODO tłumaczenia
                        variant="standard"
                        color="primary"
                        className={` w-full  ${!(formik.errors.name && formik.touched.name) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-primary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
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
                        label="Name translation" //@TODO tłumaczenia
                        variant="standard"
                        color="primary"
                        className={` w-full  ${!(formik.errors.alternateName && formik.touched.alternateName) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-primary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
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
                        label="Price" //@todo tłumaczenia
                        variant="standard"
                        color="primary"
                        className={` w-full  ${!(formik.errors.price && formik.touched.price) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-primary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
                        as={TextField}

                      />
                    
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
                        label="Alcohol percentage" //@TODO tłumaczenia
                        variant="standard"
                        color="primary"
                        className={` w-full  ${!(formik.errors.alcoholPercentage && formik.touched.alcoholPercentage) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-primary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
                        as={TextField}

                      />
                    )}
                    </div>                     

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
                  <button 
                    id="addmenuitemsubmit"
                    type="submit"
                    disabled={!formik.isValid || !formik.dirty}
                    className={` w-full border-black border dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary ${formik.isValid&&formik.dirty?`dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary`:``}  ` }
                    >
                    {t("general.save")}
                  </button>
                </Form>
              )
            }}
            </Formik>
          </div>
          <div className="border h-full w-[40%] overflow-y-auto rounded-lg">
            {/* @todo tłumacz */}
            {selectedIngredients.length>0
            ?
            <ul
              className="flex p-2 gap-1 w-full flex-wrap"  
            > 
              {
                selectedIngredients.map((ingredient) => 
                <li 
                  className="border rounded-md h-fit justify-between w-full flex p-1 "
                > 
                  <p className="overflow-hidden text-ellipsis">

                    {findIngDetails(ingredient)?.publicName}: {ingredient.amountUsed} {findIngDetails(ingredient)?.unitOfMeasurement}
                  </p>

                  <button 
                    className=" "
                    onClick={()=>{
                      setSelectedIngredients(selectedIngredients.filter((ingredientToRemove)=>{
                        return ingredientToRemove.ingredientId!==ingredient.ingredientId
                      }))
                    }}> 
                    <CloseSharp/> 
                  </button>
                </li>
                )
              }
            </ul>
            :
            <h1 className="p-2">Selected ingredients will appear here.</h1>
            //@todo tlumacz 
            }
          </div>
        </div>
      </div>

  );
};

export default MenuItemDialog;
