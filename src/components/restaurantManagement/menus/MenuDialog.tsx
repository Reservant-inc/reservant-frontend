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
import ErrorMes from "../../reusableComponents/ErrorMessage";

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
    <div className=" flex h-[90vh] w-[50vw] min-w-[950px] bg-white rounded-lg dark:bg-black p-7">
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
                <div className="flex flex-col gap-7">
                  <div>
                    <div className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.name&&formik.touched.name?"border-error text-error":"border-black text-black"}`}>
                      <label htmlFor="name">Name:</label>
                      <Field 
                        type="text" 
                        id="name" 
                        name="name"
                        className="w-full"
                        //@TODO translation
                      />
                    </div>
                    {
                      (formik.errors.name&&formik.touched.name) &&
                      <ErrorMes msg={formik.errors.name}/>
                    }
                  </div>
                  <div>
                    <div className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.alternateName&&formik.touched.alternateName?"border-error text-error":"border-black text-black"}`}>
                      <label htmlFor="alternateName">Alternate name:</label>
                      <Field 
                        type="text" 
                        id="alternateName" 
                        name="alternateName"
                        className="w-full"
                        //@TODO translation
                      />
                    </div>
                    {
                      (formik.errors.alternateName&&formik.touched.alternateName) &&
                      <ErrorMes msg={formik.errors.alternateName}/>
                    }                  
                  </div>
                  <div>
                    <div className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.menuType&&formik.touched.menuType?"border-error text-error":"border-black text-black"}`}>
                      <label htmlFor="menuType">Menu type:</label>
                      <Field 
                        id="menuType" 
                        name="menuType"
                        as={"select"}
                        className="border-none w-full"
                        //@TODO translation
                      >
                        <option className="text-black" value="" id="MenuMenuType-option-default">Select a menu type</option>
                        {/* //@TODO translation */}
                        {
                          menuTypes.map((menuType) => 
                          <option className="text-black" value={menuType}> 
                            {menuType} 
                          </option>)
                        }
                      </Field>
                      </div>
                      {
                        (formik.errors.menuType&&formik.touched.menuType) &&
                        <ErrorMes msg={formik.errors.menuType}/>
                      }        
                  </div>
                  <div>
                    <div className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.dateFrom&&formik.touched.dateFrom?"border-error text-error":"border-black text-black"}`}>
                      <label htmlFor="dateFrom">Active since:</label>
                      <Field 
                        type="date" 
                        id="dateFrom" 
                        name="dateFrom"
                        className="w-full"
                        //@TODO translation
                      />
                    </div>
                    {
                      (formik.errors.dateFrom&&formik.touched.dateFrom) &&
                      <ErrorMes msg={formik.errors.dateFrom}/>
                    }                  
                  </div>
                  <div>
                    <div className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.dateUntil&&formik.touched.dateUntil?"border-error text-error":"border-black text-black"}`}>
                      <label htmlFor="dateUntil">Active until:</label>
                      <Field 
                        type="date" 
                        id="dateUntil" 
                        name="dateUntil"
                        className="w-full"
                        //@TODO translation
                      />
                    </div>
                    {
                      (formik.errors.dateUntil&&formik.touched.dateUntil) &&
                      <ErrorMes msg={formik.errors.dateUntil}/>
                    }   
                  </div>
                  <button 
                    id="addmenuSubmit"
                    type="submit"
                    disabled={!formik.isValid || (!formik.dirty && menu===null) }
                    className={"shadow self-center h-12 min-w-1/2 w-48 justify-center items-center gap-2 flex rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black enabled:hover:text-white enabled:hover:bg-primary  " }
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


