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

interface MenuItemDialogProps {
    menu: MenuType | null;
    activeRestaurantId: number;
    menuItemToEdit?: MenuItemType | null;
    activeMenuItems?: MenuItemType[] | undefined
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
  activeMenuItems,
  menuItemToEdit, 
}) => {
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const { t } = useTranslation("global");
  const {menuItemSelectorSchema,ingredientSelectorSchema,menuItemsSchema} = useValidationSchemas();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientUsage[]>([]) //@todo set as menuItemToEdit.ingredients
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItemType[]>([])
  const [isCreating, setIsCreating] = useState<boolean>(true);
  
  useEffect (()=>{
    getIngredients();
  },[])

  useEffect (()=>{
    getMenuItems();
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
      const perPage= 5;
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

  const getMenuItems = async () => {
    try{
      const res = await fetchGET(`/my-restaurants/${activeRestaurantId}/menu-items`);
      setMenuItems(res);
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
      setPhotoFileName(res.photo.substring(9))
    }catch (error) {
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
    let photoUrl
    if(photoFile)
      try {
        photoUrl = await fetchFilesPOST("/uploads", photoFile);
        console.log(photoUrl)
      } catch (error) {
        if (error instanceof FetchError) 
          console.log(error.formatErrors())
        else 
          console.log("Unexpected error")
      }
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
          photo: photoUrl.fileName,
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
          let res = await fetchPOST(`/menus/${menu.menuId}/items`, body);
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
    let photoUrl
    if(photoFile) {
      try {
        photoUrl = await fetchFilesPOST("/uploads", photoFile);
      } catch (error) {
        if (error instanceof FetchError) 
          console.log(error.formatErrors())
        else 
          console.log("Unexpected error")
      }
    }
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
          photo: photoUrl?photoUrl.fileName:photoFileName
        },
      );
      await fetchPUT(
        `/menu-items/${menuItemToEdit?.menuItemId}`,
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
  };

  const submitSelectedMenuItems = async () => {
    if(menu!==null){
      try{
        const body = JSON.stringify({
          itemIds: getSelectedMenuItemsIds()
        });
        console.log(body)
        let res = await fetchPOST(`/menus/${menu.menuId}/items`, body);
        console.log(res)

      } catch (error) {
        if (error instanceof FetchError) 
          console.log(error.formatErrors())
        else 
          console.log("Unexpected error")
      } 
    }
  }

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


  const addMenuItem = (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {  
    let tmp = menuItems.find((e)=>e.menuItemId==values.id)
    if(tmp) {
      setSubmitting(true)
      setSelectedMenuItems([...selectedMenuItems, tmp])
      setSubmitting(false)
    }
  }

  const getIngredientDetails= (ingredient: IngredientUsage) => {
    const res = (ingredients.find((e)=>e.ingredientId==ingredient.ingredientId))
    return res;
  }
  
  const getSelectedMenuItemsIds = () => {
    let tmp: number[] = []
    for (const menuItem of selectedMenuItems){
      tmp.push(menuItem.menuItemId)
    }
    return tmp
  }

  return (
      <div className=" flex flex-col h-[90vh] w-[50vw] min-w-[700px] bg-white rounded-lg dark:bg-black p-7">
        {isCreating?
          <div className="flex w-full h-full ">
            <div className="flex h-full w-3/5   flex-col gap-6 pr-4">

              
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
                    <Form
                      className="h-full w-full"
                    >
                      <div  
                        className="h-full flex items-center flex-col   gap-6  "
                      >
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
                        {(menu !==null && menu.menuType) === "Alcohol" && (
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
                        )}
                        <div className="flex  gap-2">
                          <label
                            htmlFor="photo"
                            className={` shadow  w-48 rounded-lg justify-center items-center cursor-pointer flex p-1 gap-2   dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary ` }
                          >
                            <CloudUploadIcon/>
                            <p>
                              Upload photo
                              {/* @TODO translation */}
                            </p>
                            <VisuallyHiddenInput
                              type="file"
                              id="photo"
                              accept="image/*"
                              onChange={(e)=>{
                                if (e.target.files && e.target.files.length > 0) {
                                  setPhotoFile(e.target.files[0]);
                                  setPhotoFileName(e.target.files[0].name);
                                }
                              }}
                            />
                          </label>
                          <p className="text-nowrap  w-48 overflow-hidden text-ellipsis">
                            {t("restaurant-management.menu.selectedFile")}:<br/>{photoFileName?photoFileName:"none"}
                          </p>
                        </div>
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
            </div>
            <div className="w-2/5 border-l-[1px]  ">

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
                      className="pl-2"
                    >
                      <div className="flex gap-2">
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
                        <div className={`flex gap-2 border-b  w-1/3 ${!(formik.errors.amountUsed && formik.touched.amountUsed)?"":"border-error"}`}>
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
                          <button
                            type="submit"
                            className={`  text-grey-black  enabled:hover:text-primary enabled:cursor-pointer ` }
                            id="addIngridientToMenuItem"
                            disabled={!formik.isValid || !formik.dirty}
                          >
                            <Add/> 
                          </button> 
                        </div>
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

                <button
                  className={"items-center self-center flex justify-center shadow text-nowrap w-48 h-12 rounded-lg p-1  dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary" }
                  disabled={selectedIngredients.length<=0}
                  onClick={()=>{
                    setSelectedIngredients([]);
                  }}
                >
                    <Clear/>
                    Clear ingredients
                    {/* @TODO translation */}
                </button>
              </div>
            </div>

          </div>

          :
          <div className="flex flex-col  items-start h-full w-full gap-6">
            <div className=" w-full ">
              <Formik  
                  initialValues={{id: ""}} 
                  onSubmit={addMenuItem}
                  validationSchema={menuItemSelectorSchema}
                >
                  {(formik) => {
                    return(
                      <Form>
                        <div className="flex  justify-center w-full">
                          <Field
                            as={"select"}
                            id="id" 
                            name="id" 
                            label="id"
                            className="w-1/3 border-0 border-b"
                          >
                            <option value="" id="MI-option-default">Select a menu item</option>
                              {/* @todo t  */}
                              {activeMenuItems!==undefined &&
                                menuItems
                                .filter(menuItem=>!activeMenuItems.find(activeMI=>activeMI.menuItemId==menuItem.menuItemId))
                                .filter(menuItem=>!selectedMenuItems.find(selectedMI=>selectedMI.menuItemId==menuItem.menuItemId))
                                .map((menuItem) => 
                                <option value={menuItem.menuItemId}> 
                                  {menuItem.name}
                                </option>
                                )
                              }
                          </Field>
                            <button
                              type="submit"
                              className={`  border-b  text-grey-black  ${formik.isValid&&formik.dirty?` hover:text-primary`:``}  ` }
                              id="addMenuItemToMenu"
                              disabled={!formik.isValid || !formik.dirty}
                            >
                              <Add/>
                            </button> 
                        </div>
                      </Form>
                    )
                  }}
                </Formik>
              </div>
              <div className="flex w-full h-[70%]  items-center gap-6 flex-col">
                <div className=" shadow-inner bg-grey-0 rounded-lg overflow-y-auto p-1  w-full  h-full   ">
                  {selectedMenuItems.length>0
                  ?
                  <ul
                    className="flex h-full  w-full flex-wrap "  
                  > 
                    {
                      selectedMenuItems.map((menuItem: MenuItemType) => 
                        <li key={menuItem.menuItemId}>
                          <MenuItem
                            key={menuItem.menuItemId}
                            menuType={menu!==null?menu.menuType:""}
                            menuItem={menuItem}
                            onDelete={()=>{
                                setSelectedMenuItems(selectedMenuItems.filter((menuItemsToRemove)=>{
                                return menuItemsToRemove.menuItemId!==menuItem.menuItemId
                              }))
                            }}
                        />
                        </li>
                      )
                    }
                  </ul>
                  :
                  <h1 className="p-2">Selected menu items will appear here.</h1> //@TODO translation 
                  }
                </div>
              <div className="flex  gap-20">
                <button 
                  id="addmenuitemsubmitall"
                  type="submit"
                  onClick={submitSelectedMenuItems}
                  disabled={selectedMenuItems.length<=0}
                  className={` shadow h-12  w-48  rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary ` }
                >
                  {t("general.save")}
                </button>
                <button
                  disabled={selectedMenuItems.length<=0}
                  onClick={()=>{
                    setSelectedMenuItems([]);
                  }}
                  className={` shadow w-48 h-12 rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary ` }
                >
                    Clear all items
                    {/* @TODO translation */}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
  );
};

export default MenuItemDialog;
