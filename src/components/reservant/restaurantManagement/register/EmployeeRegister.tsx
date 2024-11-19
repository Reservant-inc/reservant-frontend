import React from 'react'
import { Formik, Form, Field, ErrorMessage, FormikValues } from 'formik'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useTranslation } from 'react-i18next'
import { useValidationSchemas } from '../../../../hooks/useValidationSchema'
import { fetchGET, fetchPOST } from '../../../../services/APIconn'
import ErrorMes from '../../../reusableComponents/ErrorMessage'
import { Save } from '@mui/icons-material'

const initialValues = {
  login: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  birthDate: ''
}

interface RegisterEmpProps {
  setIsModalOpen: Function
}

const RegisterEmp: React.FC<RegisterEmpProps> = ({ setIsModalOpen }) => {
  const [t] = useTranslation('global')
  const { employeeRegisterSchema } = useValidationSchemas()

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true)

      const body = JSON.stringify({
        login: values.login,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        password: values.password,
        birthDate: values.birthDate
      })

      await fetchPOST('/auth/register-restaurant-employee', body)

      setIsModalOpen(false)
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-register w-[500px] h-[700px] p-7">
      <Formik
        initialValues={initialValues}
        validationSchema={employeeRegisterSchema}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={handleSubmit}
      >
        {formik => (
          <Form>
            <div className="form-container flex flex-col justify-start gap-7">
              <div>
                <div
                  className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.firstName && formik.touched.firstName ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="firstName">{t('auth.firstName')}:</label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                <ErrorMessage name="firstName">
                  {msg => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div>
                <div
                  className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.lastName && formik.touched.lastName ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="lastName">{t('auth.lastName')}:</label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                <ErrorMessage name="lastName">
                  {msg => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>
              <div>
                <div
                  className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.login && formik.touched.login ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="login">Login:</label>
                  <Field
                    type="text"
                    id="login"
                    name="login"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                <ErrorMessage name="login">
                  {msg => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>
              <div>
                <div
                  className={`  flex items-center justify-start gap-3 border-b-[1px] text-nowrap ${formik.errors.phoneNumber && formik.touched.phoneNumber ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="phoneNumber">{t('auth.phoneNumber')}:</label>
                  <Field
                    as={PhoneInput}
                    international
                    defaultCountry="PL"
                    name={'phoneNumber'}
                    value={formik.values.phoneNumber}
                    onChange={(value: string) =>
                      formik.setFieldValue('phoneNumber', value)
                    }
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                <ErrorMessage name="phoneNumber">
                  {msg => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>
              <div>
                <div
                  className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.birthDate && formik.touched.birthDate ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="birthDate">Birth date:</label>
                  <Field
                    type="Date"
                    id="birthDate"
                    name="birthDate"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                <ErrorMessage name="birthDate">
                  {msg => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>
              <div>
                <div
                  className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.password && formik.touched.password ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="password">{t('auth.password')}:</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                <ErrorMessage name="password">
                  {msg => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>
              <div>
                <div
                  className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                >
                  <label htmlFor="confirmPassword">
                    {t('auth.confirmPassword')}:
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full"
                  />
                  <label>*</label>
                </div>
                <ErrorMessage name="confirmPassword">
                  {msg => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>
              <button
                className="self-center gap-1 flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:hover:bg-primary enabled:hover:text-white enabled:dark:hover:text-black"
                id="EmployeeRegisterSubmitButton"
                type="submit"
                disabled={!formik.isValid}
              >
                <Save />
                <h1 className="font-mont-md text-md">
                  {t('auth.registerButton')}
                </h1>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RegisterEmp