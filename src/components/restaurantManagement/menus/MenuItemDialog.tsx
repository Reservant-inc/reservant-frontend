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
import DefaultMenuItem from "../../../assets/images/defaultMenuItemImage.png";
import DefaultDrinkItem from "../../../assets/images/defaultDrinkItemImage.png";
import { useTranslation } from "react-i18next";
import { fetchFilesPOST, fetchGET, fetchPOST, getImage } from "../../../services/APIconn";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Ingredient, MenuItemType, MenuType } from "../../../services/types";
import { forEach, initial } from "lodash";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { Field, Form, Formik, FormikValues } from "formik";
import { CloseSharp, Cancel, ArrowRight, ArrowForward, ArrowForwardIos, SwapCalls, PlusOne, HdrPlus, Add, Save, ClearAll, Clear } from "@mui/icons-material";
import { Label } from "leaflet";
import MenuItem from "./MenuItem";

interface MenuItemDialogProps {
    menu: MenuType;
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
  menu,
  restaurantId,
  onClose,
  editedMenuItem = null, //??????????? nie wiem o co chodzi, nie dotykam
}) => {
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
 

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
      setPhotoFileName(e.target.files[0].name);
    }
  };


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
  
  const initialValuesMI = {
    id: ""
  }

  const [selectedIngredients, setSelectedIngredients] = useState<IngredientUsage[]>([])
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItemType[]>([])
  const defaultImage =
    menu.menuType === "Alcohol" ? DefaultDrinkItem : DefaultMenuItem;



  const [isCreating, setIsCreating] = useState<boolean>(false);

 

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

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


  useEffect (()=>{
    const getMenuItems = async () => {
      try{
        const res = await fetchGET(`/my-restaurants/${restaurantId}/menu-items`);
        
        setMenuItems(res);

      } catch (error) {
        console.error("Error fetching ingredients", error);
      }
    }
    getMenuItems();
  },[])
  

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    let photoUrl
    if(photoFile)
      try {
        photoUrl = await fetchFilesPOST("/uploads", photoFile);
        console.log(photoUrl)
      } catch (error) {
        console.error("Error uploading photo:", error);
        return;
      }
    let menuItemRes
    try {
      setSubmitting(true);
      const body = JSON.stringify(
        {
          restaurantId: restaurantId,
          price: values.price,
          name: values.name,
          alternateName: values.alternateName,
          alcoholPercentage: values.alcoholPercentage?values.alcoholPercentage:0,
          photo: photoUrl.fileName,
          ingredients: selectedIngredients
        },
      );
      console.log(body)

      menuItemRes = await fetchPOST(
        '/menu-items',
        body,
      );
      
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }

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
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

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

  }


  const handleSubmitMI= ( values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },) => {
      let tmp = menuItems.find((e)=>
        e.menuItemId==values.id
      )
      if(tmp)
      {
        setSubmitting(true)
        setSelectedMenuItems([...selectedMenuItems, tmp])
        setSubmitting(false)
      }
      

  }

  const findIngDetails= (ingredient: IngredientUsage) => {
    const res = (ingredients.find((e)=>e.ingredientId==ingredient.ingredientId))
    return res;
  }
  
  const convertToIds = () => {
    let tmp: number[] = []
    for (const menuItem of selectedMenuItems){
      tmp.push(menuItem.menuItemId)
    }
    return tmp
  }

  const handleSaveMIs = async (
  ) => {
    try{
      
      const body = JSON.stringify({
        itemIds: convertToIds()
      });
      console.log(body)
      let res = await fetchPOST(`/menus/${menu.menuId}/items`, body);
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    
    <div className="w-full h-full flex flex-col gap-4">
      <span className="flex w-full h-[5%]  items-center border-b justify-between">

        <h1 className="text-lg ">
          {
            isCreating
            ?
            <p>
            Create new menu item or <span onClick={()=>{setIsCreating(false)}} className="text-primary cursor-pointer">add existing</span>
            </p>
            :
            <p>
            Add existing item or <span onClick={()=>{setIsCreating(true)}} className="text-primary cursor-pointer">create new</span>
            </p>

          }
        </h1>

        <button onClick={()=>onClose()} className="hover:text-primary">
          <CloseSharp/>
        </button>

      </span>
      {isCreating?

        <div className="flex w-full h-[95%] ">
          <div className="flex w-3/5 h-full flex-col gap-6 pr-4">
            <Formik  
              initialValues={initialValuesIng} 
              onSubmit={handleSubmitIng}
            >

              {(formik) => {
                return(
                  <Form>
                    <div className="flex  gap-2">
                      <Field
                        as={"select"}
                        id="ingredientId" 
                        name="ingredientId" 
                        label="Ingredient"
                        className="w-2/3 border-0 border-b"
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
                      <div className="flex w-1/3">
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
                          className={`  border-b  text-grey-black  ${formik.isValid&&formik.dirty?` hover:text-primary`:``}  ` }
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
                      className="  w-full flex  items-center flex-col gap-6 "
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
                    
                      {menu.menuType === "Alcohol" && (
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


                        
                      <div className="flex w-full gap-2">
                        <label
                          htmlFor="photo"
                          className={` shadow  w-40 rounded-lg justify-center items-center cursor-pointer flex p-1 gap-2   dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary` }
                        
                        >
                          <CloudUploadIcon/>
                          <p>
                            Upload photo
                            {/* Dodaj zdjęcie */}
                          </p>
                          {/* @todo tlumaczneie */}
                          <VisuallyHiddenInput
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                          />

                        </label>
                        <p className="text-nowrap  overflow-hidden text-ellipsis">
                          {t("restaurant-management.menu.selectedFile")}:<br/>{photoFileName?photoFileName:"none"}
                        </p>
                      </div>


                        <button 
                          id="addmenuitemsubmit"
                          type="submit"
                          disabled={!formik.isValid || !formik.dirty}
                          className={"shadow h-12 min-w-1/2 w-40 justify-center items-center gap-2 flex rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary  " }
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
          <div className="flex w-2/5  items-center  h-full gap-6 flex-col">

            <div className="shadow-inner bg-grey-0 w-full h-5/6 overflow-y-auto rounded-lg">
              {/* @todo tłumacz */}
              {selectedIngredients.length>0
              ?
              <ul
                className="flex p-2 gap-2 h-full flex-col w-full "  
              > 
                {
                  selectedIngredients.map((ingredient) => 
                  <li 
                    className="shadow-md h-fit bg-white items-center rounded-md justify-between w-full flex p-1 "
                  > 
                    <p className="overflow-hidden text-ellipsis">

                      {findIngDetails(ingredient)?.publicName}: {ingredient.amountUsed} {findIngDetails(ingredient)?.unitOfMeasurement}
                    </p>

                    <button 
                      className="hover:text-primary "
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
            <button
              disabled={selectedIngredients.length<=0}
              onClick={()=>{
                setSelectedIngredients([]);
              }}
              className={"items-center flex justify-center shadow text-nowrap w-40 h-12 rounded-lg p-1  dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary" }
            >
                <Clear/>
                Clear ingredients
                {/* Wyczyść składniki */}
                {/* @todo t */}
            </button>
          </div>

        </div>
        :
        <div className="flex flex-col  items-start h-[95%] w-full gap-6">
          <div className=" w-full ">
            <Formik  
                initialValues={initialValuesMI} 
                onSubmit={handleSubmitMI}
                
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
                            {/* @todo tlumaczenie  */}
                            {
                                  
                              menuItems.map((menuItem) => 
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
                {/* @todo tłumacz */}
                {selectedMenuItems.length>0
                ?
                <ul
                  className="flex h-full  w-full flex-wrap "  
                > 
                  {
                    selectedMenuItems.map((menuItem: MenuItemType) => 
                      <li>

                        <MenuItem
                          menuType={menu.menuType}
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
                <h1 className="p-2">Selected menu items will appear here.</h1>
                //@todo tlumacz 
                }
              </div>
            <div className="flex  gap-20">
              <button 
                id="addmenuitemsubmitall"
                type="submit"
                onClick={handleSaveMIs}
                disabled={selectedMenuItems.length<=0}

                className={` shadow h-12  w-40  rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary ` }
              >
                {t("general.save")}
              </button>
              <button
                disabled={selectedMenuItems.length<=0}
                onClick={()=>{
                  setSelectedMenuItems([]);
                }}
                className={` shadow w-40 h-12 rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary ` }
              >
                  Clear all items
                  {/* @todo t */}
              </button>
            </div>

          </div>
        </div>
      }
    </div>

  );
};

export default MenuItemDialog;
