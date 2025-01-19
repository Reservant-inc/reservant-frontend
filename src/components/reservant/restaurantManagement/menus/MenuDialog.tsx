import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { fetchPOST, fetchGET, fetchPUT } from '../../../../services/APIconn'
import { Field, Form, Formik, FormikValues } from 'formik'
import { useValidationSchemas } from '../../../../hooks/useValidationSchema'
import { Add, Save, SaveOutlined } from '@mui/icons-material'
import { MenuItemType, MenuType } from '../../../../services/types'
import { FetchError } from '../../../../services/Errors'
import MenuItem from './MenuItem'
import { MenuScreenType } from '../../../../services/enums'
import ErrorMes from '../../../reusableComponents/ErrorMessage'
import Remove from '@mui/icons-material/Remove'

interface MenuDialogProps {
  onClose: () => void
  menu?: MenuType
  activeRestaurantId: number
}

const MenuDialog: React.FC<MenuDialogProps> = ({
  activeRestaurantId,
  onClose,
  menu
}) => {
  const { t } = useTranslation('global')
  const { menuSchema } = useValidationSchemas()
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>('')
  const [menuTypes, setMenuTypes] = useState<string[]>([])
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItemType[]>(
    menu ? menu.menuItems : []
  )

  useEffect(() => {
    getMenuItems()
  }, [])

  useEffect(() => {
    getMenuTypes()
  }, [])

  const getMenuItems = async () => {
    try {
      const res = await fetchGET(
        `/my-restaurants/${activeRestaurantId}/menu-items`
      )
      setMenuItems(res)
    } catch (error) {
      if (error instanceof FetchError) console.log(error.formatErrors())
      else console.log('Unexpected error')
    }
  }

  const getMenuTypes = async () => {
    try {
      const res = await fetchGET(`/menus/menu-types`)
      setMenuTypes(res)
    } catch (error) {
      if (error instanceof FetchError) console.log(error.formatErrors())
      else console.log('Unexpected error')
    }
  }
  const handleSaveNewMenu = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    let responseMenu
    try {
      setSubmitting(true)
      const body = JSON.stringify(
        values.alternateName
          ? {
              restaurantId: activeRestaurantId,
              name: values.name,
              alternateName: values.alternateName,
              menuType: values.menuType,
              dateFrom: values.dateFrom,
              dateUntil: values.dateUntil,
              photo: ''
            }
          : {
              restaurantId: activeRestaurantId,
              name: values.name,
              menuType: values.menuType,
              dateFrom: values.dateFrom,
              dateUntil: values.dateUntil,
              photo: ''
            }
      )

      responseMenu = await fetchPOST('/menus', body)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    }
    try {
      const body = JSON.stringify({
        itemIds: getSelectedMenuItemsIds()
      })
      await fetchPOST(`/menus/${responseMenu.menuId}/items`, body)
      setSubmitting(false)
      onClose()
    } catch (error) {
      if (error instanceof FetchError) console.log(error.formatErrors())
      else console.log('Unexpected error')
    }
  }
  const handleEditMenu = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true)
      const body = JSON.stringify({
        restaurantId: activeRestaurantId,
        name: values.name,
        alternateName: values.alternateName,
        menuType: values.menuType,
        dateFrom: values.dateFrom,
        dateUntil: values.dateUntil,
        photo: '',
        menuItemsIds: getSelectedMenuItemsIds()
      })

      await fetchPUT(`/menus/${menu?.menuId}`, body)
      onClose()
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    }
  }

  const getSelectedMenuItemsIds = () => {
    let tmp: number[] = []
    for (const menuItem of selectedMenuItems) {
      tmp.push(menuItem.menuItemId)
    }
    return tmp
  }

  return (
    <div className=" flex justify-center  w-fit w-[950px] h-[535px] bg-white rounded-lg dark:bg-black p-7 gap-7 ">
      <Formik
        initialValues={{
          name: menu ? menu.name : '',
          alternateName: menu ? menu.alternateName : '',
          menuType: menu ? menu.menuType : '',
          dateFrom: menu ? menu.dateFrom : '',
          dateUntil: menu ? menu.dateUntil : ''
        }}
        onSubmit={menu ? handleEditMenu : handleSaveNewMenu}
        validationSchema={menuSchema}
        className="w-1/3 "
      >
        {formik => {
          return (
            <Form className="flex flex-col gap-7 pl-3">
              <div>
                <div
                  className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.name && formik.touched.name ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="name">{t('restaurant-management.menu.name')}:</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full "
                  />
                  <label>*</label>
                </div>
                {formik.errors.name && formik.touched.name && (
                  <ErrorMes msg={formik.errors.name} />
                )}
              </div>
              <div>
                <div
                  className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.alternateName && formik.touched.alternateName ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="alternateName">{t('restaurant-management.menu.alternateName')}:</label>
                  <Field
                    type="text"
                    id="alternateName"
                    name="alternateName"
                    className="w-full"
                  />
                </div>
                {formik.errors.alternateName &&
                  formik.touched.alternateName && (
                    <ErrorMes msg={formik.errors.alternateName} />
                  )}
              </div>
              <div>
                <div
                  className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.menuType && formik.touched.menuType ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="menuType">{t('restaurant-management.menu.menuType')}:</label>
                  <Field
                    id="menuType"
                    name="menuType"
                    as={'select'}
                    className="border-none w-full dark:bg-black"
                  >
                    <option
                      className=""
                      value=""
                      selected={true}
                      disabled={true}
                      id="MenuMenuType-option-default"
                    >
                      {t('restaurant-management.menu.menuType')}
                    </option>
                    {menuTypes.map(menuType => (
                      <option className="text-black" value={menuType}>
                        {menuType}
                      </option>
                    ))}
                  </Field>
                  <label>*</label>
                </div>
                {formik.errors.menuType && formik.touched.menuType && (
                  <ErrorMes msg={formik.errors.menuType} />
                )}
              </div>
              <div>
                <div
                  className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.dateFrom && formik.touched.dateFrom ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="dateFrom">{t('restaurant-management.menu.activeSince')}:</label>
                  <Field
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                {formik.errors.dateFrom && formik.touched.dateFrom && (
                  <ErrorMes msg={formik.errors.dateFrom} />
                )}
              </div>
              <div>
                <div
                  className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.dateUntil && formik.touched.dateUntil ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="dateUntil">{t('restaurant-management.menu.activeUntil')}:</label>
                  <Field
                    type="date"
                    id="dateUntil"
                    name="dateUntil"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                {formik.errors.dateUntil && formik.touched.dateUntil && (
                  <ErrorMes msg={formik.errors.dateUntil} />
                )}
              </div>
              <button
                id="addmenuSubmit"
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
                className="self-center gap-2 flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:hover:bg-primary enabled:hover:text-white enabled:dark:hover:text-black"
              >
                <SaveOutlined />
                <h1 className="font-mont-md text-md">{t('general.save')}</h1>
              </button>
            </Form>
          )
        }}
      </Formik>
      <div className="flex flex-col w-2/3 gap-7">
        <form className="flex text-nowrap items-center gap-7 pr-3">
          <div className="flex items-center justify-start gap-1 w-2/3 border-b-[1px] dark:text-grey-1">
            <label className="">{t('restaurant-management.menu.menuItem')}:</label>
            <select
              name="id"
              id="MenuDialogMenuItemSelector"
              className="border-0 w-full dark:bg-black"
              onChange={e => setSelectedMenuItemId(e.target.value)}
            >
              <option
                value=""
                className="w-full"
                disabled={true}
                selected={true}
                id="MI-option-default"
              >
                {t('restaurant-management.menu.menuItem')}
              </option>
              {menuItems
                .filter(
                  menuItem =>
                    !selectedMenuItems.find(
                      selectedMenuItem =>
                        selectedMenuItem.menuItemId == menuItem.menuItemId
                    )
                )
                .map(menuItem => (
                  <option className="w-full" value={menuItem.menuItemId}>
                    {menuItem.name}
                  </option>
                ))}
            </select>
          </div>
          <button
            onClick={() => {
              let tmp = menuItems.find(
                menuItem => menuItem.menuItemId == Number(selectedMenuItemId)
              )
              setSelectedMenuItemId('')
              if (tmp) {
                setSelectedMenuItems([...selectedMenuItems, tmp])
              }
              let selector: HTMLSelectElement = document.getElementById(
                'MenuDialogMenuItemSelector'
              ) as HTMLSelectElement
              selector.selectedIndex = 0
            }}
            disabled={!Number(selectedMenuItemId)}
            id="addMenuItemToMenu"
            className="self-center gap-1 flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:hover:bg-primary enabled:hover:text-white enabled:dark:hover:text-black"
          >
            <Add />

            <h1 className="font-mont-md text-md">{t('restaurant-management.menu.addToMenu')}</h1>
          </button>
        </form>

        <div className="  dark:bg-black bg-white overflow-y-auto scroll scroll-smooth w-full  h-full rounded-lg pr-3">
          {
            selectedMenuItems.length > 0 ? (
              <ul className="flex flex-col h-full w-full gap-2">
                {selectedMenuItems.map((menuItem: MenuItemType) => (
                  <li
                    className="relative bg-white dark:bg-black rounded-lg  "
                    key={menuItem.menuItemId + menuItem.name}
                  >
                    <MenuItem
                      key={menuItem.menuItemId}
                      type={MenuScreenType.Preview}
                      menuItem={menuItem}
                      menu={menu}
                      activeRestaurantId={activeRestaurantId}
                    />
                    <button
                      className="absolute dark:bg-black top-2 right-2 flex items-center justify-center bg-white p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm"
                      onClick={() => {
                        setSelectedMenuItems(
                          selectedMenuItems.filter(
                            e => e.menuItemId !== menuItem.menuItemId
                          )
                        )
                      }}
                    >
                      <Remove className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <h1 className="p-2 dark:text-grey-1">
                {t('restaurant-management.menu.noMenuItems')}.
              </h1>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default MenuDialog
