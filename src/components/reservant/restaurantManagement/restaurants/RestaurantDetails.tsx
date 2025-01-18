import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  NativeSelect
} from '@mui/material'
import { Formik, Field, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { GroupType, RestaurantType } from '../../../../services/types'
import { LocalType } from '../../../../services/enums'
import { useTranslation } from 'react-i18next'
import {
  fetchFilesPOST,
  fetchGET,
  fetchPOST,
  fetchPUT,
  getImage
} from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/user.jpg'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface RestaurantDetailsProps {
  restaurant: RestaurantType
  open: boolean
  onClose: () => void
  onSuccess: () => void
  groups: GroupType[]
  isReadOnly: boolean
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurant,
  open,
  onClose,
  onSuccess,
  groups,
  isReadOnly
}) => {
  const validationSchema = Yup.object({
    groupName: Yup.string().required('Group Name is required'),
    name: Yup.string().required('Restaurant Name is required'),
    restaurantType: Yup.string().required('Restaurant Type is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    reservationDeposit: Yup.number()
      .min(0, 'Reservation Deposit must be non-negative')
      .required('Reservation Deposit is required'),
    maxReservationDurationMinutes: Yup.number()
      .min(30, 'Maximum reservation duration cannot be less than 30 minutes')
      .max(1440, 'Maximum reservation duration cannot exceed 1440 minutes')
      .required('Maximum reservation duration is required')
  })

  const [tags, setTags] = useState<string[]>([])
  const [logoPath, setLogoPath] = useState<string>(
    restaurant.logo || DefaultImage
  )
  const [photos, setPhotos] = useState<string[]>(restaurant.photos || [])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const generateTimeOptions = () => {
    const times = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0')
        const minute = m.toString().padStart(2, '0')
        times.push(`${hour}:${minute}`)
      }
    }
    return times
  }
  const timeOptions = generateTimeOptions()

  const { t } = useTranslation('global')

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await fetchGET('/restaurant-tags')
        setTags(tagsData)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    fetchTags()
  }, [])

  const uploadLogo = async (logoFile: File) => {
    try {
      const res = await fetchFilesPOST('/uploads', logoFile)
      setLogoPath(res.path)
      return res.fileName
    } catch (error) {
      console.error('Error uploading logo:', error)
      setErrorMessage('Failed to upload logo. Please try again.')
      return null
    }
  }

  const uploadPhoto = async (photoFile: File) => {
    try {
      const res = await fetchFilesPOST('/uploads', photoFile)
      if (res && res.fileName) {
        setPhotos(prev => [...prev, res.path]) // Dodajemy zdjęcie do stanu
        return res.fileName
      }
      throw new Error('Upload failed')
    } catch (error) {
      console.error('Error uploading photo:', error)
      setErrorMessage('Failed to upload photo. Please try again.')
      return null // Upewnij się, że zwracamy null przy błędzie
    }
  }

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true)

    try {
      const {
        groupId,
        name,
        restaurantType,
        address,
        city,
        reservationDeposit,
        maxReservationDurationMinutes,
        provideDelivery,
        description,
        tags,
        openingHours,
        logo,
        photos
      } = values

      let cleanLogo = logo
      if (cleanLogo?.startsWith('/uploads/')) {
        cleanLogo = cleanLogo.replace('/uploads/', '')
      }

      const cleanPhotos = photos.map((photo: string) =>
        photo.startsWith('/uploads/') ? photo.replace('/uploads/', '') : photo
      )

      let cleanIdCard = restaurant.idCard
      if (restaurant.idCard?.startsWith('/uploads/')) {
        cleanIdCard = cleanIdCard.replace('/uploads/', '')
      }

      let cleanBusinessPermission = restaurant.businessPermission
      if (restaurant.businessPermission?.startsWith('/uploads/')) {
        cleanBusinessPermission = cleanBusinessPermission.replace(
          '/uploads/',
          ''
        )
      }

      // Sprawdzanie zmiany grupy
      const newGroup = groups.find(group => group.restaurantGroupId === groupId)
      console.log(newGroup?.restaurantGroupId)
      if (newGroup && newGroup.restaurantGroupId !== restaurant.groupId) {
        // Jeśli groupId się zmienia, przenosimy restaurację do nowej grupy
        await fetchPOST(
          `/my-restaurants/${restaurant.restaurantId}/move-to-group`,
          JSON.stringify({ groupId: newGroup.restaurantGroupId })
        )
      }

      const data = {
        restaurantId: restaurant.restaurantId,
        groupId,
        groupName: newGroup?.name,
        name,
        restaurantType,
        address,
        city,
        reservationDeposit,
        maxReservationDurationMinutes,
        provideDelivery,
        description,
        tags,
        openingHours,
        logo: cleanLogo,
        photos: cleanPhotos,
        nip: restaurant.nip,
        postalIndex: restaurant.postalIndex,
        location: restaurant.location,
        businessPermission: cleanBusinessPermission,
        idCard: cleanIdCard
      }

      console.log('Dane wysyłane do API:', data)

      await fetchPUT(
        `/my-restaurants/${restaurant.restaurantId}`,
        JSON.stringify(data)
      )

      onSuccess()
      resetForm()
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Failed to update restaurant. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="flex justify-between items-center font-bold border-b border-grey-1 dark:text-white">
        <span>Restaurant Details</span>
        <button onClick={onClose} className="text-grey-2">
          <CloseSharpIcon />
        </button>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            groupId: restaurant.groupId,
            groupName: restaurant.groupName,
            name: restaurant.name,
            restaurantType: restaurant.restaurantType,
            address: restaurant.address,
            city: restaurant.city,
            reservationDeposit: restaurant.reservationDeposit,
            maxReservationDurationMinutes:
              restaurant.maxReservationDurationMinutes,
            provideDelivery: restaurant.provideDelivery,
            description: restaurant.description,
            tags: restaurant.tags,
            openingHours: restaurant.openingHours,
            logo: restaurant.logo,
            photos: restaurant.photos
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {formik => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Group Name
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    id="groupName"
                    name="groupName"
                    value={
                      groups?.find(
                        group =>
                          group.restaurantGroupId === formik.values.groupId
                      )?.name || ''
                    }
                    InputProps={{ readOnly: true }}
                    className="w-full font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <FormControl
                    className="w-full [&>*]:font-mont-md text-[15px] dark:text-white"
                    error={Boolean(
                      formik.errors.groupId && formik.touched.groupId
                    )}
                  >
                    <Field
                      as={Select}
                      id="group"
                      name="groupId"
                      labelId="group-label"
                      value={formik.values.groupId || ''}
                      sx={{
                        height: 40
                      }}
                      onChange={formik.handleChange}
                      className={`[&>*]:font-mont-md font-medium [&>*]:dark:text-white ${
                        !(formik.errors.groupId && formik.touched.groupId)
                          ? '[&>*]:text-black before:border-black dark:before:border-white after:border-secondary'
                          : '[&>*]:text-error dark:[&>*]:text-error before:border-error after:border-error'
                      }`}
                      helperText={
                        formik.errors.groupId &&
                        formik.touched.groupId &&
                        formik.errors.groupId
                      }
                    >
                      {groups?.map(group => (
                        <MenuItem
                          key={group.restaurantGroupId}
                          value={group.restaurantGroupId}
                          className="dark:text-white"
                        >
                          {group.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Restaurant Name
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    name="name"
                    id="name"
                    fullWidth
                    value={formik.values.name || ''}
                    InputProps={{ readOnly: true }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <Field
                    as={TextField}
                    name="name"
                    id="name"
                    fullWidth
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="restaurantType"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Business Type
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    id="restaurantType"
                    name="restaurantType"
                    fullWidth
                    value={
                      t(
                        `restaurant-register.types.${String(formik.values.restaurantType).toLowerCase()}`
                      ) || ''
                    }
                    InputProps={{
                      readOnly: true
                    }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <FormControl
                    className="w-full [&>*]:font-mont-md text-[15px] dark:text-white"
                    error={Boolean(
                      formik.errors.restaurantType &&
                        formik.touched.restaurantType
                    )}
                  >
                    <Field
                      as={Select}
                      id="restaurantType"
                      fullWidth
                      sx={{
                        height: 40
                      }}
                      name="restaurantType"
                      labelId="restaurantType-label"
                      value={formik.values.restaurantType}
                      onChange={formik.handleChange}
                      className={`[&>*]:font-mont-md font-medium [&>*]:dark:text-white ${
                        !(
                          formik.errors.restaurantType &&
                          formik.touched.restaurantType
                        )
                          ? '[&>*]:text-black before:border-black dark:before:border-white after:border-secondary'
                          : '[&>*]:text-error dark:[&>*]:text-error before:border-error after:border-error'
                      }`}
                    >
                      <MenuItem
                        id="restaurantRegister-opt-restaurant"
                        value={LocalType.Restaurant}
                        className="dark:text-white"
                      >
                        {t('restaurant-register.types.restaurant')}
                      </MenuItem>
                      <MenuItem
                        id="restaurantRegister-opt-bar"
                        value={LocalType.Bar}
                        className="dark:text-white"
                      >
                        {t('restaurant-register.types.bar')}
                      </MenuItem>
                      <MenuItem
                        id="restaurantRegister-opt-cafe"
                        value={LocalType.Cafe}
                        className="dark:text-white"
                      >
                        {t('restaurant-register.types.cafe')}
                      </MenuItem>
                    </Field>
                    {/* Wyświetlanie błędów */}
                    {formik.errors.restaurantType &&
                      formik.touched.restaurantType && (
                        <FormHelperText className="text-error dark:text-error text-[15px]">
                          {formik.errors.restaurantType}
                        </FormHelperText>
                      )}
                  </FormControl>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Address
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    name="address"
                    id="address"
                    fullWidth
                    value={formik.values.address || ''}
                    InputProps={{
                      readOnly: true
                    }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <Field
                    as={TextField}
                    name="address"
                    id="address"
                    fullWidth
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    className="font-mont-md text-[15px] dark:text-white"
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  City
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    name="city"
                    id="city"
                    fullWidth
                    value={formik.values.city || ''}
                    InputProps={{
                      readOnly: true // Ustawienie pola na tylko do odczytu
                    }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <Field
                    as={TextField}
                    name="city"
                    id="city"
                    fullWidth
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    className="font-mont-md text-[15px] dark:text-white"
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="reservationDeposit"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Reservation Deposit
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    name="reservationDeposit"
                    id="reservationDeposit"
                    type="text"
                    fullWidth
                    value={formik.values.reservationDeposit || ''}
                    InputProps={{
                      readOnly: true
                    }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <Field
                    as={TextField}
                    name="reservationDeposit"
                    id="reservationDeposit"
                    type="number"
                    fullWidth
                    error={
                      formik.touched.reservationDeposit &&
                      Boolean(formik.errors.reservationDeposit)
                    }
                    helperText={
                      formik.touched.reservationDeposit &&
                      formik.errors.reservationDeposit
                    }
                    className="font-mont-md text-[15px] dark:text-white"
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="reservationDeposit"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Max Reservation Duration in minutes
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    name="maxReservationDurationMinutes"
                    id="maxReservationDurationMinutes"
                    type="text"
                    fullWidth
                    value={formik.values.maxReservationDurationMinutes || ''}
                    InputProps={{
                      readOnly: true
                    }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <Field
                    as={TextField}
                    name="maxReservationDurationMinutes"
                    id="maxReservationDurationMinutes"
                    type="number"
                    fullWidth
                    error={
                      formik.touched.maxReservationDurationMinutes &&
                      Boolean(formik.errors.maxReservationDurationMinutes)
                    }
                    helperText={
                      formik.touched.maxReservationDurationMinutes &&
                      formik.errors.maxReservationDurationMinutes
                    }
                    className="font-mont-md text-[15px] dark:text-white"
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="provideDelivery"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Provide Delivery
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    name="provideDelivery"
                    id="provideDelivery"
                    value={formik.values.provideDelivery ? 'Yes' : 'No'}
                    fullWidth
                    InputProps={{
                      readOnly: true // Ustawienie pola na tylko do odczytu
                    }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <FormControl
                    className="w-full [&>*]:font-mont-md text-[15px] dark:text-white"
                    error={Boolean(
                      formik.errors.provideDelivery &&
                        formik.touched.provideDelivery
                    )}
                  >
                    <Field
                      as={Select}
                      id="provideDelivery"
                      fullWidth
                      sx={{
                        height: 40
                      }}
                      name="provideDelivery"
                      labelId="provideDelivery-label"
                      value={formik.values.provideDelivery ? 'true' : 'false'} // Konwertujemy boolean na string
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        // Dodajemy typ dla e
                        formik.setFieldValue(
                          'provideDelivery',
                          e.target.value === 'true'
                        ) // Konwertujemy z powrotem na boolean
                      }}
                      className={`[&>*]:font-mont-md font-medium [&>*]:dark:text-white ${
                        !(
                          formik.errors.provideDelivery &&
                          formik.touched.provideDelivery
                        )
                          ? '[&>*]:text-black before:border-black dark:before:border-white after:border-secondary'
                          : '[&>*]:text-error dark:[&>*]:text-error before:border-error after:border-error'
                      }`}
                    >
                      <MenuItem
                        id="provideDelivery-yes"
                        value="true" // Teraz używamy stringa
                        className="dark:text-white"
                      >
                        Yes
                      </MenuItem>
                      <MenuItem
                        id="provideDelivery-no"
                        value="false" // Teraz używamy stringa
                        className="dark:text-white"
                      >
                        No
                      </MenuItem>
                    </Field>

                    {/* Wyświetlanie błędów */}
                    {formik.errors.provideDelivery &&
                      formik.touched.provideDelivery && (
                        <FormHelperText className="text-error dark:text-error text-[15px]">
                          {formik.errors.provideDelivery}
                        </FormHelperText>
                      )}
                  </FormControl>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Description
                </label>
                {isReadOnly ? (
                  <Field
                    as={TextField}
                    name="description"
                    id="description"
                    value={formik.values.description}
                    fullWidth
                    InputProps={{
                      readOnly: true // Ustawienie pola na tylko do odczytu
                    }}
                    className="font-mont-md text-[15px] font-medium dark:text-white"
                  />
                ) : (
                  <Field
                    as={TextField}
                    name="description"
                    id="description"
                    fullWidth
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Tags
                </label>
                <div className="border border-grey-15 dark:border-grey-2 rounded p-4 hover:border-black">
                  <FieldArray name="tags">
                    {({ push, remove }) => (
                      <div className="flex flex-col w-full">
                        <FormGroup className="grid grid-cols-2">
                          {/* Zastosowanie grid layout */}
                          {tags.map((tag, index) => (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  className={
                                    formik.values.tags.includes(tag)
                                      ? 'text-primary [&.Mui-checked]:text-secondary'
                                      : 'text-grey-1'
                                  }
                                  checked={formik.values.tags.includes(tag)}
                                  onChange={e => {
                                    if (!isReadOnly) {
                                      // Jeśli nie jest tryb tylko do odczytu
                                      if (e.target.checked) {
                                        push(tag)
                                      } else {
                                        const idx =
                                          formik.values.tags.indexOf(tag)
                                        remove(idx)
                                      }
                                    }
                                  }}
                                  disabled={isReadOnly} // Jeśli tryb tylko do odczytu, checkbox będzie zablokowany
                                />
                              }
                              label={
                                <span className="text-[15px] text-black dark:text-white font-mont-md">
                                  {tag}
                                </span>
                              }
                            />
                          ))}
                        </FormGroup>
                        {formik.touched.tags && formik.errors.tags && (
                          <div className="text-error text-[15px] text-sm mt-1 font-mont-md">
                            {formik.errors.tags}
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="openingHours"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Opening Hours
                </label>
                <div className="border border-grey-15 dark:border-grey-2 rounded p-4 hover:border-black">
                  <FieldArray name="openingHours">
                  {({ replace }) => (
                      <div className="flex flex-col w-2/3 gap-4">
                        {/* Wyświetlanie 7 dni tygodnia od razu */}
                        {[
                          'Monday',
                          'Tuesday',
                          'Wednesday',
                          'Thursday',
                          'Friday',
                          'Saturday',
                          'Sunday'
                        ].map((day, index) => {
                          const isClosed = formik.values.openingHours[index].from === null;

                          return (
                          <div key={index} className="flex items-center gap-4">
{                             /* Checkbox do oznaczenia czy dzień jest otwarty */}
                              <Checkbox
                                disabled={isReadOnly}
                                checked={!isClosed}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    // Jeśli checkbox jest ZAZNACZONY, ustaw domyślne godziny
                                    replace(index, { from: '00:00', until: '00:00' });
                                  } else {
                                    // Jeśli checkbox jest ODZNACZONY, ustaw null
                                    replace(index, { from: null, until: null });
                                  }
                                }}
                                className="text-grey-1 [&.Mui-checked]:text-secondary"
                              />

                              <span className="text-sm font-bold text-gray-500 w-full dark:text-white">
                                {day}
                              </span>

                              {/* Pola wyboru godzin - widoczne tylko, jeśli dzień jest otwarty */}
                              {!isClosed && (
                                <>
                                  <Field
                                    as={NativeSelect}
                                    id={`openingHours[${index}].from`}
                                    name={`openingHours[${index}].from`}
                                    className="w-4/5 text-[15px] text-black dark:text-white"
                                    disabled={isReadOnly}
                                  >
                                    {timeOptions.map(time => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </Field>

                                  <span className="text-sm font-bold text-gray-500 dark:text-white">-</span>

                                  <Field
                                    as={NativeSelect}
                                    id={`openingHours[${index}].until`}
                                    name={`openingHours[${index}].until`}
                                    className="w-4/5 text-[15px] text-black dark:text-white"
                                    disabled={isReadOnly}
                                  >
                                    {timeOptions.map(time => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </Field>
                                </>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                  </FieldArray>
                </div>
              </div>

              {/* Logo Preview and Upload Button */}
              <div className="mb-4">
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Logo
                </label>
                <div className="border border-grey-15 dark:border-grey-2 rounded p-4 hover:border-black">
                  {/* Logo image display */}
                  <div className="flex items-center justify-start gap-4">
                    <img
                      className="w-32 h-32 object-cover rounded-lg" // Zwiększenie rozmiaru logo
                      src={
                        logoPath === DefaultImage
                          ? DefaultImage
                          : getImage(logoPath, logoPath)
                      }
                      alt="Logo preview"
                    />
                  </div>

                  {/* Upload button */}
                  {!isReadOnly && (
                    <div className="mt-4 flex justify-start">
                      <label
                        htmlFor={`logo-upload`}
                        className="cursor-pointer text-primary dark:text-secondary"
                      >
                        <CloudUploadIcon /> Upload Logo
                      </label>
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={async e => {
                          if (e.target.files && e.target.files.length > 0) {
                            const fileName = await uploadLogo(e.target.files[0])
                            formik.setFieldValue('logo', fileName)
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Preview and Upload Button for multiple photos */}
              <div className="mb-4">
                <label
                  htmlFor="photos"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Photos
                </label>
                <div className="border border-grey-15 dark:border-grey-2 rounded p-4 hover:border-black">
                  <FieldArray name="photos">
                    {({ push, remove }) => (
                      <div className="flex flex-wrap gap-4 overflow-x-auto">
                        {' '}
                        {/* Wrapping photos in one row with scroll */}
                        {/* Wyświetlanie zdjęć */}
                        {photos.length === 0 && <p>No photos uploaded yet</p>}
                        {photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              className="w-32 h-32 object-cover rounded-lg"
                              src={
                                photo ? getImage(photo, photo) : DefaultImage
                              }
                              alt={`Uploaded photo ${index + 1}`}
                            />
                            {/* Usuwanie zdjęcia, tylko jeśli nie jest w trybie readonly */}
                            {!isReadOnly && (
                              <button
                                type="button"
                                onClick={() => {
                                  // Usuwanie zdjęcia z formularza Formika
                                  formik.setFieldValue(
                                    'photos',
                                    formik.values.photos.filter(
                                      (_, i) => i !== index
                                    )
                                  )
                                  // Usuwanie zdjęcia z lokalnego stanu
                                  setPhotos(prevPhotos =>
                                    prevPhotos.filter((_, i) => i !== index)
                                  )
                                }}
                                className="absolute top-0 right-0 p-1 bg-black text-white rounded-full"
                              >
                                X
                              </button>
                            )}
                          </div>
                        ))}
                        {/* Input to upload new photos, tylko jeśli nie jest w trybie readonly */}
                        {!isReadOnly && (
                          <div className="w-full">
                            <label
                              htmlFor={`photos-upload`}
                              className="cursor-pointer text-primary dark:text-secondary"
                            >
                              <CloudUploadIcon /> Upload More Photos
                            </label>
                            <input
                              type="file"
                              id="photos-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={async e => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
                                  const file = e.target.files[0]
                                  const fileName = await uploadPhoto(file)
                                  if (fileName) {
                                    push(fileName) // Dodajemy zdjęcie do formularza
                                  }
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {!isReadOnly && (
                  <>
                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default RestaurantDetails
