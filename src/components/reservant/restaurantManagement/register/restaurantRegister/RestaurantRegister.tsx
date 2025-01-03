import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
// Material-UI imports
import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  TextField
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useValidationSchemas } from '../../../../../hooks/useValidationSchema'
import {
  fetchGET,
  fetchPOST,
  fetchFilesPOST
} from '../../../../../services/APIconn'
import { LocalType } from '../../../../../services/enums'
import { FetchError } from '../../../../../services/Errors'
import { RestaurantDataType, GroupType } from '../../../../../services/types'

const initialValues: RestaurantDataType = {
  name: '',
  address: '',
  postalIndex: '',
  city: '',
  nip: '',
  restaurantType: '',
  idCard: null,
  businessPermission: null,
  rentalContract: null,
  alcoholLicense: null,
  tags: [],
  provideDelivery: false,
  logo: null,
  photos: [],
  description: '',
  groupId: null,
  reservationDeposit: null,
  openingHours: [
    { from: '00:00', until: '00:00' },
    { from: '00:00', until: '00:00' },
    { from: '00:00', until: '00:00' },
    { from: '00:00', until: '00:00' },
    { from: '00:00', until: '00:00' },
    { from: '00:00', until: '00:00' },
    { from: '00:00', until: '00:00' }
  ],
  maxReservationDurationMinutes: null,
  location: {
    latitude: 52.396255,
    longitude: 20.913649
  }
}

interface RestaurantRegisterProps {
  onRegisterSucces: () => void
}

const RestaurantRegister: React.FC<RestaurantRegisterProps> = ({
  onRegisterSucces
}) => {
  const [activeStep, setActiveStep] = useState<number>(1)
  const [requestLoading, setRequestLoading] = useState<boolean>(false)

  const [tags, setTags] = useState<string[]>([])
  const [serverError, setServerError] = useState<string | null>(null)
  const [groups, setGroups] = useState<null | GroupType[]>(null)

  const { t } = useTranslation('global')

  const {
    RestaurantRegisterStep1Schema,
    RestaurantRegisterStep2Schema,
    RestaurantRegisterStep3Schema
  } = useValidationSchemas()

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

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsData = await fetchGET('/my-restaurant-groups')
        setGroups(groupsData)
      } catch (error) {
        console.error('Error fetching groups:', error)
      }
    }

    fetchGroups()
  }, [])

  const handleNextClick = async (formik: any) => {
    setRequestLoading(true) // Ustawienie loading state

    try {
      // Wykonaj walidację formularza
      const errors = await formik.validateForm()

      if (Object.keys(errors).length > 0) {
        // Jeśli są błędy, zaznacz pola jako dotknięte i wyświetl błędy
        formik.setTouched(
          Object.keys(errors).reduce((acc: any, key: string) => {
            acc[key] = true
            return acc
          }, {})
        )
        return // Zatrzymaj proces przejścia dalej
      }

      if (activeStep === 1) {
        const body = JSON.stringify({
          name: formik.values.name,
          nip: formik.values.nip,
          restaurantType: formik.values.restaurantType,
          address: formik.values.address,
          postalIndex: formik.values.postalIndex,
          city: formik.values.city,
          location: formik.values.location, 
        })

        const response = await fetchPOST(
          '/my-restaurants/validate-first-step',
          body
        )
      }

      setServerError(null)
      setActiveStep(prevStep => prevStep + 1)
    } catch (error) {
      if (error instanceof FetchError) {
        setServerError(error.formatErrors())
      }
    } finally {
      setRequestLoading(false) // Zakończenie loading state
    }
  }
  
  const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&addressdetails=1`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }
      const data = await response.json();
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      } else {
        throw new Error('No coordinates found for the given address');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };
  

  const handleSubmit = async (values: any, formikHelpers: any) => {
    setRequestLoading(true)

    try {
      const fileUploadPromises: Promise<any>[] = []
      const fileFieldMapping: { field: string; isArray: boolean }[] = []

      // Krok 2: Dodawanie do tablicy plików do przesłania i ich mapowanie
      if (values.logo) {
        fileUploadPromises.push(fetchFilesPOST('/uploads', values.logo))
        fileFieldMapping.push({ field: 'logo', isArray: false })
      }
      if (values.photos && values.photos.length > 0) {
        values.photos.forEach((photo: File) => {
          fileUploadPromises.push(fetchFilesPOST('/uploads', photo))
          fileFieldMapping.push({ field: 'photos', isArray: true })
        })
      }
      if (values.idCard) {
        fileUploadPromises.push(fetchFilesPOST('/uploads', values.idCard))
        fileFieldMapping.push({ field: 'idCard', isArray: false })
      }
      if (values.businessPermission) {
        fileUploadPromises.push(
          fetchFilesPOST('/uploads', values.businessPermission)
        )
        fileFieldMapping.push({ field: 'businessPermission', isArray: false })
      }
      if (values.rentalContract) {
        fileUploadPromises.push(
          fetchFilesPOST('/uploads', values.rentalContract)
        )
        fileFieldMapping.push({ field: 'rentalContract', isArray: false })
      }
      if (values.alcoholLicense) {
        fileUploadPromises.push(
          fetchFilesPOST('/uploads', values.alcoholLicense)
        )
        fileFieldMapping.push({ field: 'alcoholLicense', isArray: false })
      }

      const uploadResults = await Promise.all(fileUploadPromises)

      const updatedValues = { ...values }

      uploadResults.forEach((result, index) => {
        const { field, isArray } = fileFieldMapping[index]
        if (isArray) {
          if (!updatedValues[field]) {
            updatedValues[field] = []
          }
          updatedValues[field].push(result.fileName)
        } else {
          updatedValues[field] = result.fileName
        }
      })

      if (updatedValues.photos && Array.isArray(updatedValues.photos)) {
        updatedValues.photos = updatedValues.photos
          .map((photo: any) =>
            typeof photo === 'string' ? photo : photo.fileName
          ) // Zamiana obiektów na fileName
          .filter((photo: any) => photo !== undefined) // Usuwanie wartości undefined
      }

      console.log('Zaktualizowane wartości formularza:', updatedValues)

      if (updatedValues.groupId === null) {
        const restaurantGroupData = {
          name: `${updatedValues.name} Restaurants Group`,
          restaurantIds: []
        }

        // Wysyłamy zapytanie do /my-restaurants-groups
        const groupResponse = await fetchPOST(
          '/my-restaurant-groups',
          JSON.stringify(restaurantGroupData)
        )

        if (!groupResponse || !groupResponse.restaurantGroupId) {
          console.error('Nie udało się utworzyć grupy restauracji.')
        }

        // Przypisanie groupId z odpowiedzi
        updatedValues.groupId = groupResponse.restaurantGroupId
      }

      console.log(updatedValues)

      // Krok 3: Wysyłamy zaktualizowane dane restauracji do /my-restaurants
      setTimeout(() => {}, 1000)
      const response = await fetchPOST(
        '/my-restaurants',
        JSON.stringify(updatedValues)
      )

      onRegisterSucces()
    } catch (error) {
      console.error(
        'Nieoczekiwany błąd podczas przesyłania plików lub wysyłania formularza:',
        error
      )
      setServerError('Wystąpił błąd podczas wysyłania.')
    } finally {
      setRequestLoading(false) // Wyłączenie stanu ładowania
    }
  }

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

  const formatAddress = (address: string): string => {
    // Usuń prefiksy kończące się kropką (np. "ul.")
    const cleanedAddress = address.replace(/\b\w+\.\s*/g, '').trim();
  
    // Dopasuj numer budynku (ciąg cyfr na końcu lub w środku)
    const match = cleanedAddress.match(/(\d+)(.*)/);
    if (match) {
      const [, number, rest] = match;
      return `${number} ${rest.trim()}`;
    }
  
    // Jeśli brak numeru, zwróć adres bez zmian
    return cleanedAddress;
  };
  

  return (
    <div id="restaurantRegister-div-wrapper">
      <h1
        id="restaurantRegister-header"
        className="mb-8 text-center text-3xl font-bold dark:text-white"
      >
        {t('restaurant-register.header')}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={
          activeStep === 1
            ? RestaurantRegisterStep1Schema
            : activeStep === 2
              ? RestaurantRegisterStep2Schema
              : RestaurantRegisterStep3Schema
        }
        onSubmit={(values, formikHelpers) =>
          handleSubmit(values, formikHelpers)
        }
      >
        {formik => (
          <Form className="w-full h-full mt-[10%]">
            <div className="form-container h-full flex flex-col items-center gap-4">
              {/* Pasek postępu */}
              <div className="relative w-4/5 h-4 bg-grey-0 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${(activeStep / 3) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm text-black font-mont-md dark:text-grey-2">
                {`Step ${activeStep} of 3`}
              </span>
              {/* Step 1 */}
              <CSSTransition
                in={activeStep === 1}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
              >
                <div className="flex w-full flex-col items-center gap-4">
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    label="Restaurant Name *"
                    variant="standard"
                    as={TextField}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${!(formik.errors.name && formik.touched.name) ? '[&>*]:text-black [&>*]:before:border-black dark:[&>*]:before:border-white [&>*]:after:border-secondary' : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'}`}
                    helperText={
                      formik.errors.name &&
                      formik.touched.name &&
                      formik.errors.name
                    }
                  />

                  <Field
                    type="text"
                    id="address"
                    name="address"
                    label="Address *"
                    variant="standard"
                    as={TextField}
                    onBlur={async () => {
                      let { address, postalIndex, city } = formik.values;
                      if (address && postalIndex && city) {
                        address = formatAddress(address);
                        const fullAddress = `${address}, ${postalIndex}, ${city}`;
                        try {
                          const coordinates = await fetchCoordinates(fullAddress);
                          formik.setFieldValue('location', coordinates);
                          console.log('Coordinates set in form:', coordinates);
                        } catch (error) {
                          console.error('Error fetching coordinates:', error);
                        }
                      }
                    }}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${!(formik.errors.address && formik.touched.address) ? '[&>*]:text-black dark:[&>*]:before:border-white [&>*]:before:border-black [&>*]:after:border-secondary' : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'}`}
                    helperText={
                      formik.errors.address &&
                      formik.touched.address &&
                      formik.errors.address
                    }
                  />

                  <Field
                    type="text"
                    id="postalIndex"
                    name="postalIndex"
                    label="Postal Code *"
                    variant="standard"
                    as={TextField}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                      !(formik.errors.postalIndex && formik.touched.postalIndex)
                        ? '[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary dark:[&>*]:before:border-white'
                        : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                    }`}
                    helperText={
                      formik.errors.postalIndex &&
                      formik.touched.postalIndex &&
                      formik.errors.postalIndex
                    }
                  />

                  <Field
                    type="text"
                    id="city"
                    name="city"
                    label="City *"
                    variant="standard"
                    as={TextField}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${!(formik.errors.city && formik.touched.city) ? '[&>*]:text-black [&>*]:before:border-black dark:[&>*]:before:border-white [&>*]:after:border-secondary' : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'}`}
                    helperText={
                      formik.errors.city &&
                      formik.touched.city &&
                      formik.errors.city
                    }
                  />

                  <Field
                    type="text"
                    id="nip"
                    name="nip"
                    label="NIP *"
                    variant="standard"
                    as={TextField}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                      !(formik.errors.nip && formik.touched.nip)
                        ? '[&>*]:text-black [&>*]:before:border-black dark:[&>*]:before:border-white [&>*]:after:border-secondary'
                        : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                    }`}
                    helperText={
                      formik.errors.nip &&
                      formik.touched.nip &&
                      formik.errors.nip
                    }
                  />

                  <FormControl
                    variant="standard"
                    className="w-4/5 [&>*]:font-mont-md text-[15px] dark:text-white"
                    error={Boolean(
                      formik.errors.restaurantType &&
                        formik.touched.restaurantType
                    )}
                  >
                    <InputLabel
                      id="restaurantType-label"
                      className={`[&>*]:label-[20px] ${
                        !(
                          formik.errors.restaurantType &&
                          formik.touched.restaurantType
                        )
                          ? 'dark:text-white text-black '
                          : 'text-error dark:text-error'
                      }`}
                    >
                      Business Type *
                    </InputLabel>
                    <Field
                      as={Select}
                      id="restaurantType"
                      name="restaurantType"
                      labelId="restaurantType-label"
                      value={formik.values.restaurantType}
                      onChange={formik.handleChange}
                      className={`[&>*]:label-[20px]  [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                        !(
                          formik.errors.restaurantType &&
                          formik.touched.restaurantType
                        )
                          ? '[&>*]:text-black before:border-black dark:before:border-white after:border-secondary'
                          : '[&>*]:text-error dark:[&>*]:text-error before:border-error after:border-error'
                      }`}
                      helperText={
                        formik.errors.restaurantType &&
                        formik.touched.restaurantType &&
                        formik.errors.restaurantType
                      }
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

                  <div className="flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleNextClick(formik)}
                      className={`flex h-[50px] w-[70px] cursor-pointer items-center justify-center rounded-lg shadow-md bg-primary text-white
                          }`}
                    >
                      Next
                    </button>

                    {serverError && (
                      <div className="text-error p-2">Server Error</div>
                    )}
                  </div>
                </div>
              </CSSTransition>

              {/* Step 2 */}
              <CSSTransition
                in={activeStep === 2}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
              >
                <div className="flex w-full flex-col items-center gap-4">
                  <FieldArray name="tags">
                    {({ push, remove }) => (
                      <div className="flex flex-col w-4/5">
                        <FormLabel className="text text-black font-mont-md mb-2 dark:text-white">
                          Tags *
                        </FormLabel>
                        <FormGroup className="grid grid-cols-2">
                          {' '}
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
                                    if (e.target.checked) {
                                      push(tag)
                                    } else {
                                      const idx =
                                        formik.values.tags.indexOf(tag)
                                      remove(idx)
                                    }
                                  }}
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
                            {formik.errors.tags}{' '}
                            {/* nie wiem co z tym zrobić */}
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                  <div className="[&>*]:label-[20px] w-[88%] [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white">
                    <FormControlLabel
                      label={
                        <span className="text-[15px]">Provide Delivery</span>
                      }
                      control={
                        <Checkbox
                          id="provideDelivery"
                          name="provideDelivery"
                          checked={formik.values.provideDelivery}
                          onChange={formik.handleChange}
                          className="text-grey-1 [&.Mui-checked]:text-secondary"
                        />
                      }
                      labelPlacement="start"
                      className="flex items-center gap-12 w-full justify-end "
                    />
                  </div>

                  <FieldArray name="openingHours">
                    {({ push, remove }) => (
                      <div className="flex flex-col w-4/5 gap-4">
                        <FormLabel className="text  text-[15px] text-black font-mont-md mb-2 dark:text-white">
                          Opening Hours *
                        </FormLabel>

                        {/* Wyświetlanie 7 dni tygodnia od razu */}
                        {[
                          'Monday',
                          'Tuesday',
                          'Wednesday',
                          'Thursday',
                          'Friday',
                          'Saturday',
                          'Sunday'
                        ].map((day, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-500 w-full dark:text-white ">
                              {day}
                            </span>

                            <Field
                              as={NativeSelect}
                              id={`openingHours[${index}].from`}
                              name={`openingHours[${index}].from`}
                              className="[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white [&>*]:text-black before:border-black before:border-black dark:before:border-white after:border-secondary"
                            >
                              <option value="" disabled>
                                From
                              </option>
                              {timeOptions.map(time => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </Field>

                            <span className="text-sm font-bold text-gray-500 dark:text-white">
                              -
                            </span>

                            <Field
                              as={NativeSelect}
                              id={`openingHours[${index}].until`}
                              name={`openingHours[${index}].until`}
                              className="[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:text-black [&>*]:dark:text-white before:border-black dark:before:border-white after:border-secondary"
                            >
                              <option value="" disabled>
                                Until
                              </option>
                              {timeOptions.map(time => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </Field>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>

                  <Field
                    type="text"
                    id="description"
                    name="description"
                    label="Description *"
                    variant="standard"
                    as={TextField}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${!(formik.errors.description && formik.touched.description) ? '[&>*]:text-black [&>*]:before:border-black dark:[&>*]:before:border-white [&>*]:after:border-secondary' : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'}`}
                    helperText={
                      formik.errors.description &&
                      formik.touched.description &&
                      formik.errors.description
                    }
                  />
                  <Field
                    type="text"
                    id="reservationDeposit"
                    name="reservationDeposit"
                    label="Reservation deposit *"
                    variant="standard"
                    as={TextField}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${!(formik.errors.reservationDeposit && formik.touched.reservationDeposit) ? '[&>*]:text-black [&>*]:before:border-black dark:[&>*]:before:border-white [&>*]:after:border-secondary' : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'}`}
                    helperText={
                      formik.errors.reservationDeposit &&
                      formik.touched.reservationDeposit &&
                      formik.errors.reservationDeposit
                    }
                  />
                  <Field
                    type="text"
                    id="maxReservationDurationMinutes"
                    name="maxReservationDurationMinutes"
                    label="Maximum reservation duration (minutes) *"
                    variant="standard"
                    as={TextField}
                    className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${!(formik.errors.maxReservationDurationMinutes && formik.touched.maxReservationDurationMinutes) ? '[&>*]:text-black [&>*]:before:border-black dark:[&>*]:before:border-white [&>*]:after:border-secondary' : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'}`}
                    helperText={
                      formik.errors.maxReservationDurationMinutes &&
                      formik.touched.maxReservationDurationMinutes &&
                      formik.errors.maxReservationDurationMinutes
                    }
                  />
                  <div className="flex gap-5">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="dark:text-white"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNextClick(formik)}
                      className={`flex h-[50px] w-[70px] cursor-pointer items-center justify-center rounded-lg shadow-md bg-primary text-white
                          }`}
                    >
                      Next
                    </button>

                    {serverError && (
                      <div className="text-error p-2">Server Error</div>
                    )}
                  </div>
                </div>
              </CSSTransition>

              {/* Step 3 */}
              <CSSTransition
                in={activeStep === 3}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
              >
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="flex items-center w-4/5 gap-4">
                    <label
                      htmlFor="logo"
                      className="font-mont-md text-black text-sm flex-1 dark:text-white"
                    >
                      Logo *
                    </label>
                    <button
                      type="button"
                      className="flex items-center dark:text-white font-mont-md text-xs"
                      onClick={() => document.getElementById('logo')?.click()}
                    >
                      {formik.errors.logo && formik.touched.logo && (
                        <div className="text-error text-xs">
                          {formik.errors.logo}
                        </div>
                      )}
                      {formik.values.logo ? 'file attached' : ''}
                      <AttachFileIcon className="text-primary" />
                    </button>
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      onChange={event => {
                        const file = event.currentTarget.files?.[0]
                        formik.setFieldValue('logo', file)
                      }}
                      className="hidden"
                      accept="image/png, image/jpeg"
                    />
                  </div>

                  <div className="flex items-center w-4/5 gap-4">
                    <label
                      htmlFor="photos"
                      className="font-mont-md text-black dark:text-white text-sm flex-1 [&>*]:dark:text-white"
                    >
                      Photos *
                    </label>
                    <button
                      type="button"
                      className="flex items-center font-mont-md dark:text-white text-xs"
                      onClick={() => document.getElementById('photos')?.click()}
                    >
                      {formik.errors.photos && formik.touched.photos && (
                        <div className="text-error text-xs">
                          {formik.errors.photos}
                        </div>
                      )}
                      {Array.isArray(formik.values.photos) &&
                      formik.values.photos.length > 0
                        ? formik.values.photos.length === 1
                          ? 'file attached'
                          : `${formik.values.photos.length} files attached`
                        : ''}
                      <AttachFileIcon className="text-primary" />
                    </button>
                    <input
                      type="file"
                      id="photos"
                      name="photos"
                      multiple
                      onChange={event => {
                        const files = Array.from(
                          event.currentTarget.files || []
                        )
                        formik.setFieldValue('photos', files)
                      }}
                      className="hidden"
                      accept="image/png, image/jpeg"
                    />
                  </div>

                  <div className="flex items-center w-4/5 gap-4">
                    <label
                      htmlFor="idCard"
                      className="font-mont-md text-black dark:text-white text-sm flex-1 [&>*]:dark:text-white"
                    >
                      ID Card *
                    </label>
                    <button
                      type="button"
                      className="flex items-center font-mont-md dark:text-white text-xs"
                      onClick={() => document.getElementById('idCard')?.click()}
                    >
                      {formik.errors.idCard && formik.touched.idCard && (
                        <div className="text-error text-xs">
                          {formik.errors.idCard}
                        </div>
                      )}
                      {formik.values.idCard ? 'file attached' : ''}
                      <AttachFileIcon className="text-primary" />
                    </button>
                    <input
                      type="file"
                      id="idCard"
                      name="idCard"
                      onChange={event => {
                        const file = event.currentTarget.files?.[0]
                        formik.setFieldValue('idCard', file)
                      }}
                      className="hidden"
                      accept="application/pdf"
                    />
                  </div>

                  <div className="flex items-center w-4/5 gap-4">
                    <label
                      htmlFor="businessPermission"
                      className="font-mont-md text-black text-sm flex-1 dark:text-white [&>*]:dark:text-white"
                    >
                      Business Permission *
                    </label>
                    <button
                      type="button"
                      className="flex items-center font-mont-md dark:text-white text-xs"
                      onClick={() =>
                        document.getElementById('businessPermission')?.click()
                      }
                    >
                      {formik.errors.businessPermission &&
                        formik.touched.businessPermission && (
                          <div className="text-error text-xs">
                            {formik.errors.businessPermission}
                          </div>
                        )}
                      {formik.values.businessPermission ? 'file attached' : ''}
                      <AttachFileIcon className="text-primary" />
                    </button>
                    <input
                      type="file"
                      id="businessPermission"
                      name="businessPermission"
                      onChange={event => {
                        const file = event.currentTarget.files?.[0]
                        formik.setFieldValue('businessPermission', file)
                      }}
                      className="hidden"
                      accept="application/pdf"
                    />
                  </div>

                  {/* Rental Contract (Optional) */}
                  <div className="flex items-center w-4/5 gap-4">
                    <label
                      htmlFor="rentalContract"
                      className="font-mont-md text-black text-sm flex-1 dark:text-white [&>*]:dark:text-white"
                    >
                      Rental Contract
                    </label>
                    <button
                      type="button"
                      className="flex items-center font-mont-md dark:text-white text-xs"
                      onClick={() =>
                        document.getElementById('rentalContract')?.click()
                      }
                    >
                      {formik.values.rentalContract ? 'file attached' : ''}
                      <AttachFileIcon className="text-primary" />
                    </button>
                    <input
                      type="file"
                      id="rentalContract"
                      name="rentalContract"
                      onChange={event => {
                        const file = event.currentTarget.files?.[0]
                        formik.setFieldValue('rentalContract', file)
                      }}
                      className="hidden"
                      accept="application/pdf"
                    />
                  </div>

                  {/* Alcohol License (Optional) */}
                  <div className="flex items-center w-4/5 gap-4">
                    <label
                      htmlFor="alcoholLicense"
                      className="font-mont-md text-black text-sm dark:text-white flex-1 [&>*]:dark:text-white"
                    >
                      Alcohol License
                    </label>
                    <button
                      type="button"
                      className="flex items-center font-mont-md dark:text-white text-xs"
                      onClick={() =>
                        document.getElementById('alcoholLicense')?.click()
                      }
                    >
                      {formik.values.alcoholLicense ? 'file attached' : ''}
                      <AttachFileIcon className="text-primary" />
                    </button>
                    <input
                      type="file"
                      id="alcoholLicense"
                      name="alcoholLicense"
                      onChange={event => {
                        const file = event.currentTarget.files?.[0]
                        formik.setFieldValue('alcoholLicense', file)
                      }}
                      className="hidden"
                      accept="application/pdf"
                    />
                  </div>

                  <FormControl
                    variant="standard"
                    className="w-4/5 [&>*]:font-mont-md text-[15px] dark:text-white"
                    error={Boolean(
                      formik.errors.groupId && formik.touched.groupId
                    )}
                  >
                    <InputLabel
                      id="group-label"
                      className={`[&>*]:label-[20px] ${
                        !(formik.errors.groupId && formik.touched.groupId)
                          ? 'dark:text-white text-black '
                          : 'text-error dark:text-error'
                      }`}
                    >
                      {t('restaurant-register.group')}
                    </InputLabel>
                    <Field
                      as={Select}
                      id="group"
                      name="groupId"
                      labelId="group-label"
                      value={formik.values.groupId || ''}
                      onChange={formik.handleChange}
                      className={`[&>*]:label-[20px]  [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
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

                  <div className="flex gap-5">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="dark:text-white"
                    >
                      Back
                    </button> 
                    <button
                      type="submit"
                      disabled={!formik.isValid}
                      className={`flex h-[50px] w-[70px] cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid && formik.dirty ? 'bg-primary text-white' : 'bg-grey-1'}`}
                    >
                      {requestLoading ? (
                        <CircularProgress size={24} className="text-white" />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </div>
              </CSSTransition>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RestaurantRegister
