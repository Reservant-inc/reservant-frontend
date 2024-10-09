import React, { useEffect, useState } from "react";
import {
  TextField,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchFilesPOST, fetchGET, fetchPOST, fetchPUT, getImage } from "../../../services/APIconn";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Ingredient, IngredientUsage, MenuItemType, MenuType } from "../../../services/types";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { Field, Form, Formik, FormikValues } from "formik";
import { CloseSharp, ArrowForwardIos, Add, Save, Clear, KeyboardDoubleArrowDown, Remove } from "@mui/icons-material";
import MenuItem from "./MenuItem";
import { FetchError } from "../../../services/Errors";
import DefaultMenuItemImage from "../../../assets/images/defaultMenuItemImage.png"

interface MenuItemDialogProps {
  menu?: MenuType ;
  activeRestaurantId: number;
  menuItemToEdit?: MenuItemType | null;
  activeMenuItems?: MenuItemType[] | undefined
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

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  menu,
  activeRestaurantId,
  menuItemToEdit, 
  onClose,
}) => {
  
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [photoPath, setPhotoPath] = useState<string>("");
  const { t } = useTranslation("global");
  const {ingredientSelectorSchema,menuItemsSchema} = useValidationSchemas();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientUsage[]>([])
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  useEffect (()=>{
    getIngredients();
  },[])



  useEffect (()=>{
    if(menuItemToEdit){
      getMenuItemToEditDetails()
    }
  },[])

  const getIngredients = async () => {
    try{
      let page=0;
      let totalPages = 1;
      const perPage= 20;
      let tmp:Ingredient[] = []

      while (page < totalPages){
        const res = await fetchGET(`/restaurants/${activeRestaurantId}/ingredients?page=${page++}&perPage=${perPage}`);
        totalPages=res.totalPages;
        for(const i in res.items)
          tmp.push(res.items[i]);
      }
      setIngredients(tmp);
    }catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    }
  }

  

  const getMenuItemToEditDetails = async () => {
    try{
      const res = await fetchGET(`/menu-items/${menuItemToEdit?.menuItemId}`);
      setSelectedIngredients(res.ingredients)
      setPhotoPath(res.photo)
      setPhotoFileName(res.photo.substr(9))
    }catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    }
  }

  const uploadPhoto = async (photoFile: File) => {
    try {
      const res = await fetchFilesPOST("/uploads", photoFile);
      setPhotoPath(res.path);
      setPhotoFileName(res.fileName);
    } catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    }
  }

  const onSubmitNewMenuItem = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
   
    let menuItemRes
    try {
      setSubmitting(true);
      const body = JSON.stringify(
        {
          restaurantId: activeRestaurantId,
          price: values.price,
          name: values.name,
          alternateName: values.alternateName,
          alcoholPercentage: values.alcoholPercentage?values.alcoholPercentage:0,
          photo: photoFileName,
          ingredients: selectedIngredients
        },
      );
      menuItemRes = await fetchPOST(
        '/menu-items',
        body,
      );
    } catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    } finally {
      setSubmitting(false);
    }
    if(menu!==null){
      try{
        setSubmitting(true);
          const body = JSON.stringify({
            itemIds: [
              menuItemRes.menuItemId
            ],
          });
          console.log(body)
          let res = await fetchPOST(`/menus/${menu?.menuId}/items`, body);
          console.log(res)
      } catch (error) {
        if (error instanceof FetchError) 
          console.log(error.formatErrors())
        else 
          console.log("Unexpected error")
      } finally {
        setSubmitting(false);
      }
    }
  };

  const onSubmitEditedMenuItem = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    
    try {
      setSubmitting(true);
      const body = JSON.stringify(
        {
          restaurantId: activeRestaurantId,
          price: values.price,
          name: values.name,
          alternateName: values.alternateName,
          alcoholPercentage: values.alcoholPercentage?values.alcoholPercentage:0,
          ingredients: selectedIngredients,
          photo: photoFileName
        },
      );
      await fetchPUT(
        `/menu-items/${menuItemToEdit?.menuItemId}`,
        body,
      );
      onClose()
    } catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    } finally {
      setSubmitting(false);
    }
  };

  

  const addIngredient = (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitting(true)
    setSelectedIngredients([...selectedIngredients, {
        ingredientId: values.ingredientId,
        amountUsed: values.amountUsed
    }])
    setSubmitting(false)
  }


  const getIngredientDetails= (ingredient: IngredientUsage) => {
    const res = (ingredients.find((e)=>e.ingredientId==ingredient.ingredientId))
    return res;
  }
 

  return (
      <div className=" flex h-[90vh] w-[50vw] min-w-[950px] bg-white rounded-lg dark:bg-black p-7">
          <div className="flex">
              <Formik
                id="menuitem-formik"
                initialValues={{
                  price: menuItemToEdit?.price,
                  name: menuItemToEdit?.name,
                  alternateName: menuItemToEdit?.alternateName?menuItemToEdit.alternateName:"",
                  alcoholPercentage: menuItemToEdit?.alcoholPercentage?menuItemToEdit.alcoholPercentage:0
                }}
                validationSchema={menuItemsSchema}
                onSubmit={menuItemToEdit?onSubmitEditedMenuItem:onSubmitNewMenuItem}
              >
                {(formik) => {
                  return(
                    <Form className="h-full w-full flex gap-7">
                      <div className="relative w-48 h-48" onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>

                        <img className=" w-full w-full absolute " src={getImage(photoPath, DefaultMenuItemImage)} />
                          {
                            isHovered 
                            && 
                            <div className="bg-semi-trans h-full w-full absolute flex items-center justify-center">
                              <label
                                htmlFor="photo"
                                className={` shadow rounded-lg justify-center items-center cursor-pointer flex p-1 gap-2   dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary ` }
                              >
                                <CloudUploadIcon/>
                                <p>
                                  Upload photo
                                  {/* @TODO translation */}
                                </p>
                              </label>
                            </div>
                          } 
                          <VisuallyHiddenInput
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={(e)=>{
                              if (e.target.files && e.target.files.length > 0) {
                                uploadPhoto(e.target.files[0])
                              }
                            }}
                          />
                      </div>

                      <div className="flex flex-col gap-7">
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          helperText={
                            formik.errors.name &&
                            formik.touched.name &&
                            formik.errors.name
                          }
                          label="Name" //@TODO translation
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
                          label="Name translation" //@TODO translation
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
                          label="Price" //@TODO translation
                          variant="standard"
                          color="primary"
                          className={` w-full  ${!(formik.errors.price && formik.touched.price) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-primary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
                          as={TextField}
                        />
                        <Field
                          type="text"
                          id="alcoholPercentage"
                          name="alcoholPercentage"
                          helperText={
                            formik.errors.alcoholPercentage &&
                            formik.touched.alcoholPercentage &&
                            formik.errors.alcoholPercentage
                          }
                          label="Alcohol percentage" //@TODO translation
                          variant="standard"
                          color="primary"
                          className={` w-full  ${!(formik.errors.alcoholPercentage && formik.touched.alcoholPercentage) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-primary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
                          as={TextField}
                        />
                       
                        <button 
                          id="addmenuitemsubmit"
                          type="submit"
                          disabled={!formik.isValid || (!formik.dirty && !menuItemToEdit) || selectedIngredients.length<=0}
                          className={"shadow h-12 min-w-1/2 w-48 justify-center items-center gap-2 flex rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary  " }
                        >
                          <Save/>
                          {t("general.save")}
                        </button>
                      </div>
                    </Form>
                  )
                }}
              </Formik>

              <div className="flex   h-full gap-6 flex-col">
              <Formik  
                initialValues={{
                  ingredientId: "",
                  amountUsed: ""
                }} 
                onSubmit={addIngredient}
                validationSchema={ingredientSelectorSchema}
              >
                {(formik) => {
                  return(
                    <Form
                      className=" flex flex-col"
                    >
                      <div className="flex ">
                        <Field
                          as={"select"}
                          id="ingredientId" 
                          name="ingredientId" 
                          label="Ingredient"
                          className="w-2/3  border-0 border-b"
                        >
                          <option value="" id="ingredientSelector-option-default">Select an ingredient</option>
                            {/* //@TODO translation */}
                            {
                              ingredients.filter(ingredient=>!selectedIngredients.find(ingredientUsage=>ingredientUsage.ingredientId==ingredient.ingredientId)).map((ingredient) => 
                              <option value={ingredient.ingredientId}> 
                                {ingredient.publicName}  ({ingredient.unitOfMeasurement}) 
                              </option>)
                            }
                        </Field>
                        <div className={` border-b  w-1/3 ${!(formik.errors.amountUsed && formik.touched.amountUsed)?"":"border-error"}`}>
                          <Field 
                            type="text" 
                            id="amountUsed" 
                            name="amountUsed"
                            className={` w-full [&>*]:before:border-0 [&>*]:after:border-0  ${!(formik.errors.amountUsed && formik.touched.amountUsed) ? "[&>*]:text-black " : "[&>*]:text-error" }`} 
                            variant="standard"
                            label="Amount"
                            as={TextField}
                            //@TODO translation
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          type="submit"
                          className={"items-center  flex justify-center shadow  w-48 h-12 rounded-lg p-1  dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary" }
                          id="addIngridientToMenuItem"
                          disabled={!formik.isValid || !formik.dirty}
                        >
                          <Add/> 
                          Add Ingredient usage
                          {/* @TODO translation */}
                        </button> 
                        <button
                          className={"items-center flex justify-center shadow  w-48 h-12 rounded-lg p-1  dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary" }
                          disabled={selectedIngredients.length<=0}
                          onClick={()=>{
                            setSelectedIngredients([]);
                          }}
                          >
                            <Clear/>
                            Clear all ingredients
                            {/* @TODO translation */}
                        </button>
                      </div>
                    </Form>
                  )
                }}
              </Formik>
              <h1 className="pl-2">Selected ingredients:</h1>

                <div className="shadow-inner  w-full h-full overflow-y-auto ">
                  {selectedIngredients.length>0
                  ?
                  <ul
                    className="flex h-full flex-col w-full "  
                  > 
                    {
                      selectedIngredients.map((ingredient) => 
                      <li 
                        key={ingredient.ingredientId}
                        className="h-fit hover:bg-grey-0 bg-white border-white border items-center p-2 justify-between w-full flex"
                      > 
                        <p className="overflow-hidden text-ellipsis">

                          {getIngredientDetails(ingredient)?.publicName}: {ingredient.amountUsed} {getIngredientDetails(ingredient)?.unitOfMeasurement}
                        </p>
                        <button 
                          className="hover:text-primary "
                          onClick={()=>{
                            setSelectedIngredients(selectedIngredients.filter((ingredientToRemove)=>{
                              return ingredientToRemove.ingredientId!==ingredient.ingredientId
                            }))
                          }}> 
                          <Remove/> 
                        </button>
                      </li>
                      )
                    }
                  </ul>
                  :
                  <h1 className="p-2">Selected ingredients will appear here.</h1> //@TODO translation
                  }
                </div>
              </div>
            </div>
      </div>
  );
};

export default MenuItemDialog;
