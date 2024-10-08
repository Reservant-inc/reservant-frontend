import React, { useEffect, useState } from "react";
import {
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchPOST, fetchGET, fetchPUT } from "../../../services/APIconn";
import { Field, Form, Formik, FormikValues } from "formik";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { Add, Save } from "@mui/icons-material";
import { MenuItemType, MenuType } from "../../../services/types";
import { FetchError } from "../../../services/Errors";
import MenuItem from "./newMenus/MenuItem";
import {MenuScreenType} from "../../../services/enums"

interface MenuDialogProps {
  onClose: () => void;
  menu?: MenuType
  activeRestaurantId: number
}

const MenuDialog: React.FC<MenuDialogProps> = ({
  activeRestaurantId,
  onClose,
  menu,
}) => {
  const { t } = useTranslation("global");
  const {menuSchema, menuItemSelectorSchema} = useValidationSchemas()
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [menuTypes, setMenuTypes] = useState<string[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItemType[]>(menu?menu.menuItems:[])

  useEffect (()=>{
    getMenuItems();
  },[])

  useEffect (()=>{
    getMenuTypes();
  },[])

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

  const getMenuTypes = async () => {
    try{
      const res = await fetchGET(`/menus/menu-types`);
      setMenuTypes(res);
    }catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    }
  }
  const handleSaveNewMenu = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    let responseMenu
    try {
      setSubmitting(true);
      const body = JSON.stringify({
        restaurantId: activeRestaurantId,
        name: values.name,
        alternateName: values.alternateName,
        menuType: values.type,
        dateFrom: values.dateFrom,
        dateUntil: values.dateUntil,
      });
  
      responseMenu = await fetchPOST("/menus", body);
      
    }catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error")
      }
    }
    try{
      const body = JSON.stringify({
        itemIds: getSelectedMenuItemsIds()
      });
      await fetchPOST(`/menus/${responseMenu.menuId}/items`, body);
      setSubmitting(false)
      onClose();

    } catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    } 
  };
  const handleEditedNewMenu = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    let responseMenu
    try {
      setSubmitting(true);
      const body = JSON.stringify({
        restaurantId: activeRestaurantId,
        name: values.name,
        alternateName: values.alternateName,
        menuType: values.type,
        dateFrom: values.dateFrom,
        dateUntil: values.dateUntil,
      });
  
      await fetchPUT(`/menus/${menu?.menuId}`, body);
      
    }catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error")
      }
    }
    try{
      const body = JSON.stringify({
        itemIds: getSelectedMenuItemsIds()
      });
      await fetchPOST(`/menus/${menu?.menuId}/items`, body);
      setSubmitting(false)
      onClose();

    } catch (error) {
      if (error instanceof FetchError) 
        console.log(error.formatErrors())
      else 
        console.log("Unexpected error")
    } 
  };
  
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
 
  const getSelectedMenuItemsIds = () => {
    let tmp: number[] = []
    for (const menuItem of selectedMenuItems){
      tmp.push(menuItem.menuItemId)
    }
    return tmp
  }


  return (
      <div className="flex">
        <div>
          <Formik
            initialValues={{ 
              name: menu?menu.name:"",
              alternateName: menu?menu.alternateName:"",
              menuType: menu?menu.menuType:"",
              dateFrom: menu?menu.dateFrom:"",
              dateUntil: menu?menu.dateUntil:"",
            }} 
            onSubmit={menu?handleEditedNewMenu:handleSaveNewMenu}
            validationSchema={menuSchema}
          >
            {(formik) => {
              return(
                <Form>
                  <div>
                    <Field 
                      type="text" 
                      id="name" 
                      name="name"
                      className={` w-full [&>*]:before:border-0 [&>*]:after:border-0  ${!(formik.errors.name && formik.touched.name) ? "[&>*]:text-black " : "[&>*]:text-error" }`} 
                      variant="standard"
                      label="name"
                      as={TextField}
                      //@TODO translation
                    />
                    <Field 
                      type="text" 
                      id="alternateName" 
                      name="alternateName"
                      className={` w-full [&>*]:before:border-0 [&>*]:after:border-0  ${!(formik.errors.alternateName && formik.touched.alternateName) ? "[&>*]:text-black " : "[&>*]:text-error" }`} 
                      variant="standard"
                      label="alternateName"
                      as={TextField}
                      //@TODO translation
                    />
                    <Field 
                      id="menuType" 
                      name="menuType"
                      className={` w-full [&>*]:before:border-0 [&>*]:after:border-0  ${!(formik.errors.menuType && formik.touched.menuType) ? "[&>*]:text-black " : "[&>*]:text-error" }`} 
                      label="menuType"
                      as={"select"}
                      //@TODO translation
                    >
                      <option value="" id="MenuMenuType-option-default">Select a menu type</option>
                      {/* //@TODO translation */}
                      {
                        menuTypes.map((menuType) => 
                        <option value={menuType}> 
                          {menuType} 
                        </option>)
                      }
                    </Field>
                    <Field 
                      type="date" 
                      id="dateFrom" 
                      name="dateFrom"
                      className={` w-full [&>*]:before:border-0 [&>*]:after:border-0  ${!(formik.errors.dateFrom && formik.touched.dateFrom) ? "[&>*]:text-black " : "[&>*]:text-error" }`} 
                      variant="standard"
                      label="dateFrom"
                      //@TODO translation
                    />
                    <Field 
                      type="date" 

                      id="dateUntil" 
                      name="dateUntil"
                      className={` w-full [&>*]:before:border-0 [&>*]:after:border-0  ${!(formik.errors.dateUntil && formik.touched.dateUntil) ? "[&>*]:text-black " : "[&>*]:text-error" }`} 
                      label="dateUntil"
                      //@TODO translation
                    />
                    <button 
                      id="addmenuitemsubmit"
                      type="submit"
                      disabled={!formik.isValid || !formik.dirty}
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
                              {menuItems
                              .filter(menuItem=>!menu?.menuItems.find(activeMI=>activeMI.menuItemId==menuItem.menuItemId))
                              .filter(menuItem=>!selectedMenuItems.find(selectedMI=>selectedMI.menuItemId==menuItem.menuItemId))
                              .map((menuItem) => 
                              <option value={menuItem.menuItemId}> 
                                {menuItem.name}
                              </option>
                              )}
                          </Field>
                          <button
                            type="submit"
                            className={`  border-b  text-grey-black  ${formik.isValid&&formik.dirty?` hover:text-primary`:``}  ` }
                            id="addMenu"
                            disabled={!formik.isValid || !formik.dirty}
                          >
                            <Add/>
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
                            type={MenuScreenType.Preview}
                            menuItem={menuItem}
                            menu={menu}
                            activeRestaurantId={activeRestaurantId}
                        />
                        </li>
                      )
                    }
                  </ul>
                  :
                  <h1 className="p-2">Selected menu items will appear here.</h1> //@TODO translation 
                  }
                </div>
                
                
            </div>
          </div>
      </div>
  );
};

export default MenuDialog;


