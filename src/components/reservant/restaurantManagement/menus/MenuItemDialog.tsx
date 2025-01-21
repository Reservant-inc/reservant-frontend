import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  fetchFilesPOST,
  fetchGET,
  fetchPOST,
  fetchPUT,
  getImage
} from '../../../../services/APIconn'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  Ingredient,
  IngredientUsage,
  MenuItemType,
  MenuType
} from '../../../../services/types'
import { useValidationSchemas } from '../../../../hooks/useValidationSchema'
import { Field, Form, Formik, FormikValues } from 'formik'
import { Add, Remove, SaveOutlined } from '@mui/icons-material'
import { FetchError } from '../../../../services/Errors'
import DefaultMenuItemImage from '../../../../assets/images/defaultMenuItemImage.png'
import ErrorMes from '../../../reusableComponents/ErrorMessage'

interface MenuItemDialogProps {
  menu?: MenuType
  activeRestaurantId: number
  menuItemToEdit?: MenuItemType | null
  activeMenuItems?: MenuItemType[] | undefined
  onClose: Function
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  menu,
  activeRestaurantId,
  menuItemToEdit,
  onClose
}) => {
  const [photoFileName, setPhotoFileName] = useState<string>('')
  const [photoPath, setPhotoPath] = useState<string>('')
  const { t } = useTranslation('global')
  const { ingredientSelectorSchema, menuItemsSchema } = useValidationSchemas()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientUsage[]
  >([])
  const [isHovered, setIsHovered] = useState<boolean>(false)

  useEffect(() => {
    getIngredients()
  }, [])

  useEffect(() => {
    if (menuItemToEdit) {
      getMenuItemToEditDetails()
    }
  }, [])

  const getIngredients = async () => {
    try {
      let page = 0
      let totalPages = 1
      const perPage = 20
      let tmp: Ingredient[] = []

      while (page < totalPages) {
        const res = await fetchGET(
          `/restaurants/${activeRestaurantId}/ingredients?page=${page++}&perPage=${perPage}`
        )
        totalPages = res.totalPages
        for (const i in res.items) tmp.push(res.items[i])
      }
      setIngredients(tmp)
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error('Unexpected error')
    }
  }

  const getMenuItemToEditDetails = async () => {
    try {
      const res = await fetchGET(`/menu-items/${menuItemToEdit?.menuItemId}`)
      setSelectedIngredients(res.ingredients)
      setPhotoPath(res.photo)
      setPhotoFileName(res.photo.substr(9))
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error('Unexpected error')
    }
  }

  const uploadPhoto = async (photoFile: File) => {
    try {
      const res = await fetchFilesPOST('/uploads', photoFile)
      setPhotoPath(res.path)
      setPhotoFileName(res.fileName)
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error('Unexpected error')
    }
  }

  const onSubmitNewMenuItem = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    let menuItemRes
    try {
      setSubmitting(true)
      const body = JSON.stringify({
        restaurantId: activeRestaurantId,
        price: values.price,
        name: values.name,
        alternateName: values.alternateName,
        alcoholPercentage: values.alcoholPercentage
          ? values.alcoholPercentage
          : 0,
        photo: photoFileName,
        ingredients: selectedIngredients
      })
      menuItemRes = await fetchPOST('/menu-items', body)
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error('Unexpected error')
    } finally {
      setSubmitting(false)
    }
    if (menu !== null) {
      try {
        setSubmitting(true)
        const body = JSON.stringify({
          itemIds: [menuItemRes.menuItemId]
        })
        await fetchPOST(`/menus/${menu?.menuId}/items`, body)
        onClose()
      } catch (error) {
        if (error instanceof FetchError) console.error(error.formatErrors())
        else console.error('Unexpected error')
      } finally {
        setSubmitting(false)
      }
    }
  }

  const onSubmitEditedMenuItem = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true)
      const body = JSON.stringify({
        restaurantId: activeRestaurantId,
        price: values.price,
        name: values.name,
        alternateName: values.alternateName,
        alcoholPercentage: values.alcoholPercentage
          ? values.alcoholPercentage
          : 0,
        ingredients: selectedIngredients,
        photo: photoFileName
      })
      await fetchPUT(`/menu-items/${menuItemToEdit?.menuItemId}`, body)
      onClose()
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error('Unexpected error')
    } finally {
      setSubmitting(false)
    }
  }

  const addIngredient = (values: FormikValues) => {
    setSelectedIngredients([
      ...selectedIngredients,
      {
        ingredientId: values.ingredientId,
        amountUsed: values.amountUsed
      }
    ])
  }

  const getIngredientDetails = (ingredient: IngredientUsage) => {
    const res = ingredients.find(e => e.ingredientId == ingredient.ingredientId)
    return res
  }

  return (
    <div className=" flex justify-center w-[1000px] h-[450px] bg-white rounded-lg dark:bg-black p-7 gap-7 ">
      <Formik
        id="menuitem-formik"
        initialValues={{
          price: menuItemToEdit?.price,
          name: menuItemToEdit?.name,
          alternateName: menuItemToEdit?.alternateName
            ? menuItemToEdit.alternateName
            : '',
          alcoholPercentage: menuItemToEdit?.alcoholPercentage
            ? menuItemToEdit.alcoholPercentage
            : ''
        }}
        validationSchema={menuItemsSchema}
        onSubmit={menuItemToEdit ? onSubmitEditedMenuItem : onSubmitNewMenuItem}
      >
        {formik => {
          return (
            <Form className="h-full flex gap-7 items-start">
              <div
                className="relative min-w-64 min-h-64 flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  className=" w-64 h-64 absolute rounded-lg"
                  src={getImage(photoPath, DefaultMenuItemImage)}
                />
                {isHovered && (
                  <div className="bg-semi-trans w-64 h-64 absolute flex items-center justify-center rounded-lg">
                    <label
                      htmlFor="photo"
                      className={
                        'shadow hover:cursor-pointer self-center h-10 w-48 justify-center items-center gap-1 flex rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary  dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary  '
                      }
                    >
                      <CloudUploadIcon />
                      {t('restaurant-management.menu.upload')}
                    </label>
                  </div>
                )}
                <VisuallyHiddenInput
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      uploadPhoto(e.target.files[0])
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-7">
                <div>
                  <div
                    className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.name && formik.touched.name ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                  >
                    <label htmlFor="name">
                      {t('restaurant-management.menu.name')}:
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full "
                      //@TODO translation
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
                    <label htmlFor="alternateName">
                      {t('restaurant-management.menu.alternateName')}:
                    </label>
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
                    className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.price && formik.touched.price ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                  >
                    <label htmlFor="price">
                      {t('restaurant-management.menu.price')}:
                    </label>
                    <Field
                      type="text"
                      id="price"
                      name="price"
                      className="w-full"
                    />
                    <label>*</label>
                  </div>
                  {formik.errors.price && formik.touched.price && (
                    <ErrorMes msg={formik.errors.price} />
                  )}
                </div>
                <div>
                  <div
                    className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.alcoholPercentage && formik.touched.alcoholPercentage ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                  >
                    <label htmlFor="alcoholPercentage">
                      {t(
                        'restaurant-management.menu.menuItemAlcoholPercentage'
                      )}
                      :
                    </label>
                    <Field
                      type="text"
                      id="alcoholPercentage"
                      name="alcoholPercentage"
                      className="w-full"
                    />
                  </div>
                  {formik.errors.alcoholPercentage &&
                    formik.touched.alcoholPercentage && (
                      <ErrorMes msg={formik.errors.alcoholPercentage} />
                    )}
                </div>
                <button
                  id="addmenuitemsubmit"
                  type="submit"
                  disabled={
                    !formik.isValid ||
                    (!formik.dirty && !menuItemToEdit) ||
                    selectedIngredients.length <= 0
                  }
                  className="self-center gap-2 flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:hover:bg-primary enabled:hover:text-white enabled:dark:hover:text-black"
                >
                  <SaveOutlined />
                  <h1 className="font-mont-md text-md">{t('general.save')}</h1>
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>

      <div className="flex flex-col w-1/3 gap-7">
        <Formik
          initialValues={{
            ingredientId: '',
            amountUsed: ''
          }}
          onSubmit={(values, { resetForm }) => {
            addIngredient(values)
            resetForm()
          }}
          validationSchema={ingredientSelectorSchema}
        >
          {formik => {
            return (
              <Form className="flex flex-col pr-3">
                <div className="flex flex-col gap-7">
                  <div className="flex  items-center justify-start gap-1 border-b-[1px] text-nowrap border-black text-black dark:text-grey-1 dark:border-white">
                    <label className="">
                      {t('restaurant-management.menu.ingredient')}:
                    </label>
                    <Field
                      as={'select'}
                      id="ingredientId"
                      name="ingredientId"
                      className="border-0 w-full dark:bg-black"
                    >
                      <option
                        value=""
                        className="w-full"
                        disabled={true}
                        selected={true}
                        id="ingredientSelector-option-default"
                      >
                        {t('restaurant-management.menu.ingredient')}
                      </option>
                      {ingredients
                        .filter(
                          ingredient =>
                            !selectedIngredients.find(
                              ingredientUsage =>
                                ingredientUsage.ingredientId ==
                                ingredient.ingredientId
                            )
                        )
                        .map(ingredient => (
                          <option
                            className="w-full"
                            value={ingredient.ingredientId}
                          >
                            {ingredient.publicName} (
                            {ingredient.unitOfMeasurement})
                          </option>
                        ))}
                    </Field>
                  </div>
                  <div className="">
                    <div className="flex items-center gap-7">
                      <div
                        className={`w-2/3 flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.amountUsed && formik.touched.amountUsed ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                      >
                        <label htmlFor="alternateName">
                          {t('restaurant-management.menu.amount')}:
                        </label>
                        <Field
                          type="text"
                          id="amountUsed"
                          name="amountUsed"
                          className="w-full"
                          //@TODO translation
                        />
                      </div>
                      <button
                        id="addIngridientToMenuItem"
                        type="submit"
                        disabled={!formik.isValid || !formik.dirty}
                        className="self-center gap-1 flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:hover:bg-primary enabled:hover:text-white enabled:dark:hover:text-black"
                      >
                        <Add />
                        <h1 className="text-nowrap font-mont-md text-md">
                          {t('restaurant-management.menu.addUsage')}
                        </h1>
                      </button>
                    </div>
                    {formik.errors.amountUsed && formik.touched.amountUsed && (
                      <ErrorMes msg={formik.errors.amountUsed} />
                    )}
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>

        <div className="dark:bg-black bg-white overflow-y-auto scroll scroll-smooth w-full   rounded-lg pr-3">
          {selectedIngredients.length > 0 ? (
            <ul className="flex flex-col  max-h-full w-full gap-2">
              {selectedIngredients.map(ingredient => (
                <li
                  key={ingredient.ingredientId + ingredient.amountUsed}
                  className="h-fit w-full gap-1 dark:text-grey-0  bg-white dark:bg-black items-center p-2 justify-between flex border-[1px] border-grey-1 dark:border-grey-5 rounded-lg"
                >
                  <p className="overflow-hidden text-ellipsis">
                    {getIngredientDetails(ingredient)?.publicName}:{' '}
                    {ingredient.amountUsed}{' '}
                    {getIngredientDetails(ingredient)?.unitOfMeasurement}
                  </p>
                  <button
                    className=" dark:bg-black  flex items-center justify-center  p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm"
                    onClick={() => {
                      setSelectedIngredients(
                        selectedIngredients.filter(
                          ingredientToRemove =>
                            ingredientToRemove.ingredientId !==
                            ingredient.ingredientId
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
            <h1 className="p-2 dark:text-grey-0">
              {t('restaurant-management.menu.noIngradietns')}.
            </h1>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuItemDialog
