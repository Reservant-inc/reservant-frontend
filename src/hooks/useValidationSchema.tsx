import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { fetchGET } from '../services/APIconn'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const useValidationSchemas = () => {
  const [t] = useTranslation('global')

  const loginSchema = yup.object({
    login: yup.string().required(t('errors.login.login')),
    password: yup.string().required(t('errors.login.password'))
  })

  const userRegisterSchema = yup.object({
    firstName: yup
      .string()
      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t('errors.user-register.firstName.matches')
      )
      .required(t('errors.user-register.firstName.required')),

    lastName: yup
      .string()
      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t('errors.user-register.lastName.matches')
      )
      .required(t('errors.user-register.lastName.required')),

    login: yup
      .string()
      .matches(
        /^[a-zA-Z0-9]+$/,
        t('errors.user-register.login.invalid') //
      )
      .required(t('errors.user-register.login.required'))
      .test('unique login', t('errors.user-register.login.taken'), login => {
        return new Promise((resolve, reject) => {
          fetchGET(`/auth/is-unique-login?login=${login}`)
            .then(res => {
              if (res) resolve(true)
              else resolve(false)
            })
            .catch(error => {
              console.error(error)
            })
        })
      }),

    email: yup
      .string()
      .email(t('errors.user-register.email.matches'))
      .required(t('errors.user-register.email.required')),

    phoneNumber: yup
      .string()
      .required(t('errors.user-register.phoneNumber.required'))
      .test(
        'phone number valid',
        t('errors.user-register.phoneNumber.matches'),
        phone => {
          return isValidPhoneNumber(phone)
        }
      ),

    birthDate: yup
      .date()
      .min('1900-01-01', t('errors.user-register.birthDate.min'))
      .max('2007-01-01', t('errors.user-register.birthDate.max'))
      .required(t('errors.user-register.birthDate.required')),

    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)])(?=.{8,})/,
        t('errors.user-register.password.matches')
      )
      .required(t('errors.user-register.password.required')),

    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password'), ''],
        t('errors.user-register.confirmPassword.matches')
      )
      .required(t('errors.user-register.confirmPassword.required'))
  })

  const employeeRegisterSchema = yup.object({
    firstName: yup
      .string()

      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t('errors.user-register.firstName.matches')
      )
      .required(t('errors.user-register.firstName.required')),

    lastName: yup
      .string()
      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t('errors.user-register.lastName.matches')
      )
      .required(t('errors.user-register.lastName.required')),

    login: yup
      .string()
      .required(t('errors.user-register.login.required'))
      .matches(/^[1-9a-zA-Z]+$/, t('errors.user-register.login.matches'))
      .test('unique login', t('errors.user-register.login.taken'), login => {
        return new Promise((resolve, reject) => {
          fetchGET(`/auth/is-unique-login?login=${login}`)
            .then(res => {
              if (res) resolve(true)
              else resolve(false)
            })
            .catch(error => {
              console.error(error)
            })
        })
      }),

    phoneNumber: yup
      .string()
      .matches(
        /^\+[0-9]{11,15}$/,
        t('errors.user-register.phoneNumber.matches')
      )
      .required(t('errors.user-register.phoneNumber.required')),

    birthDate: yup
      .date()
      .min('1900-01-01', t('errors.user-register.birthDate.min'))
      .max('2007-01-01', t('errors.user-register.birthDate.max'))
      .required(t('errors.user-register.birthDate.required')),

    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)])(?=.{8,})/,
        t('errors.user-register.password.matches')
      )
      .required(t('errors.user-register.password.required')),

    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password'), ''],
        t('errors.user-register.confirmPassword.matches')
      )
      .required(t('errors.user-register.confirmPassword.required'))
  })

  const RestaurantAddEmployeeSchema = yup
    .object({
      isBackdoorEmployee: yup.boolean(),
      isHallEmployee: yup.boolean(),
      selectedRestaurant: yup
        .string()
        .required('please select one of the available restaurants')
    })
    .test(
      'at-least-one-checkbox',
      t('errors.employee-register.employeeRole.required'),
      obj => {
        if (obj.isBackdoorEmployee || obj.isHallEmployee) {
          return true
        }

        return new yup.ValidationError([
          new yup.ValidationError(
            t('errors.add-employee.employeeRole.required'),
            null,
            'isBackdoorEmployee'
          ),
          new yup.ValidationError(
            t('errors.add-employee.employeeRole.required'),
            null,
            'isHallEmployee'
          )
        ])
      }
    )
  const RestaurantAddEmployeeSchema2 = yup
    .object({
      isBackdoorEmployee: yup.boolean(),
      isHallEmployee: yup.boolean(),
      selectedEmp: yup
        .string()
        .required('please select one of the available employees')
    })
    .test(
      'at-least-one-checkbox',
      t('errors.employee-register.employeeRole.required'),
      obj => {
        if (obj.isBackdoorEmployee || obj.isHallEmployee) {
          return true
        }

        return new yup.ValidationError([
          new yup.ValidationError(
            t('errors.add-employee.employeeRole.required'),
            null,
            'isBackdoorEmployee'
          ),
          new yup.ValidationError(
            t('errors.add-employee.employeeRole.required'),
            null,
            'isHallEmployee'
          )
        ])
      }
    )

  const RestaurantRegisterStep3Schema = yup.object({
    logo: yup.mixed().required(t('errors.restaurant-register.logo.required')),
    photos: yup
      .array()
      .min(1, t('errors.restaurant-register.photos.required'))
      .required(t('errors.restaurant-register.photos.required')),
    idCard: yup.mixed().required(t('errors.restaurant-register.id.required')),
    businessPermission: yup
      .mixed()
      .required(t('errors.restaurant-register.businessPermission.required'))
  })

  const RestaurantRegisterStep2Schema = yup.object({
    description: yup
      .string()
      .max(200, t('errors.restaurant-register.description.max'))
      .min(3, t('errors.restaurant-register.description.min'))
      .required(t('errors.restaurant-register.description.required')),
    tags: yup.array().min(3, t('errors.restaurant-register.tags.min')),
    reservationDeposit: yup
      .number()
      .typeError(t('errors.restaurant-register.reservationDeposit.number')) // Komunikat dla nieprawidłowej liczby
      .min(0, t('errors.restaurant-register.reservationDeposit.min'))
      .max(300, t('errors.restaurant-register.reservationDeposit.max'))
      .required(t('errors.restaurant-register.reservationDeposit.required')),
    maxReservationDurationMinutes: yup
      .number()
      .typeError(
        t('errors.restaurant-register.maxReservationDurationMinutes.number')
      ) // Komunikat dla nieprawidłowej liczby
      .min(
        30,
        t('errors.restaurant-register.maxReservationDurationMinutes.min')
      )
      .max(
        1140,
        t('errors.restaurant-register.maxReservationDurationMinutes.max')
      )
      .required(
        t('errors.restaurant-register.maxReservationDurationMinutes.required')
      )
  })

  const RestaurantRegisterStep1Schema = yup.object({
    name: yup.string().required(t('errors.restaurant-register.name.required')),
    postalIndex: yup
      .string()
      .matches(
        /^[0-9]{2}-[0-9]{3}$/,
        t('errors.restaurant-register.postalCode.matches')
      )
      .required(t('errors.restaurant-register.postalCode.required')),
    city: yup
      .string()
      .required(t('errors.restaurant-register.city.required'))
      .matches(/^[A-Za-z\s-]+$/, t('errors.restaurant-register.city.invalid')),
    nip: yup
      .string()
      .matches(/^[0-9]{10}$/, t('errors.restaurant-register.tin.matches'))
      .required(t('errors.restaurant-register.tin.required')),
    restaurantType: yup
      .string()
      .required(t('errors.restaurant-register.businessType.required')),
    location: yup
      .object({
        latitude: yup
          .number()
          .notOneOf(
            [0],
            t('errors.restaurant-register.location.latitude.invalid')
          )
          .required(t('errors.restaurant-register.location.latitude.required')),
        longitude: yup
          .number()
          .notOneOf(
            [0],
            t('errors.restaurant-register.location.longitude.invalid')
          )
          .required(t('errors.restaurant-register.location.longitude.required'))
      })
      .required(t('errors.restaurant-register.address.required'))
  })

  const RestaurantEditSchema = yup.object({
    name: yup.string().required(t('errors.restaurant-register.name.required')),
    address: yup
      .string()
      .required(t('errors.restaurant-register.address.required')),
    postalIndex: yup
      .string()
      .matches(
        /^[0-9]{2}-[0-9]{3}$/,
        t('errors.restaurant-register.postalCode.matches')
      )
      .required(t('errors.restaurant-register.postalCode.required')),
    city: yup.string().required(t('errors.restaurant-register.city.required')),
    restaurantType: yup
      .string()
      .required(t('errors.restaurant-register.businessType.required')),
    description: yup
      .string()
      .max(200, t('errors.restaurant-register.description.max'))
      .min(3, t('errors.restaurant-register.description.min'))
      .required(t('errors.restaurant-register.description.required')),
    tags: yup.array().min(3, t('errors.restaurant-register.tags.min'))
  })

  // @todo t

  const menuItemsSchema = yup.object({
    price: yup.number().required().min(0).max(500),
    name: yup.string().required().max(20),
    alternateName: yup.string().max(50),
    alcoholPercentage: yup.number().min(0).max(100)
  })

  // @todo t

  const ingredientSelectorSchema = yup.object({
    ingredientId: yup.string().required(),
    amountUsed: yup.number().required()
  })

  const menuSchema = yup.object({
    name: yup
    .string()
    .max(20, t('errors.create-menu.name.max'))
    .required(t('errors.create-menu.name.required')),
  alternateName: yup
    .string()
    .max(20, t('errors.create-menu.alternateName.max')),
  menuType: yup
    .string()
    .required(t('errors.create-menu.menuType.required')),
  dateFrom: yup
    .string()
    .required(t('errors.create-menu.dateFrom.required')),
    dateUntil: yup
    .string()
    .nullable()
    .test(
      'is-valid-date',
      t('errors.create-menu.dateUntil.valid'),
      (value) => {
        if (!value) return true;
        const today = new Date();
        const untilDate = new Date(value);
        return untilDate >= today; 
      }
    )
    .test(
      'is-after-dateFrom',
      t('errors.create-menu.dateUntil.afterDateFrom'),
      function (value) {
        const { dateFrom } = this.parent;
        if (!value || !dateFrom) return true; 
        return new Date(value) > new Date(dateFrom); 
      }
    )
    // .required(t('errors.create-menu.dateUntil.required')),
  })

  return {
    menuSchema,
    loginSchema,
    ingredientSelectorSchema,
    userRegisterSchema,
    employeeRegisterSchema,
    RestaurantAddEmployeeSchema,
    RestaurantRegisterStep1Schema,
    RestaurantRegisterStep2Schema,
    RestaurantRegisterStep3Schema,
    RestaurantEditSchema,
    menuItemsSchema,
    RestaurantAddEmployeeSchema2
  }
}
