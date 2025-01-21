import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { useValidationSchemas } from '../../hooks/useValidationSchema'
import { fetchPOST } from '../../services/APIconn'
import { TextField } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { CSSTransition } from 'react-transition-group'
import MuiPhoneNumber from 'mui-phone-number'
import { parsePhoneNumber } from 'libphonenumber-js'

const initialValues = {
  firstName: '',
  lastName: '',
  login: '',
  email: '',
  phoneNumber: '',
  birthDate: '',
  password: '',
  confirmPassword: ''
}

const UserRegister: React.FC = () => {
  const navigate = useNavigate()
  const [t] = useTranslation('global')
  const { userRegisterSchema } = useValidationSchemas()
  const [requestLoading, setRequestLoading] = useState<boolean>(false)
  const [registerError, setRegisterError] = useState<string>('')
  const [activeStep, setActiveStep] = useState<number>(1)

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true)
      setRequestLoading(true)

      const number = parsePhoneNumber(values.phoneNumber)

      const body = JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        login: values.login,
        email: values.email,
        phoneNumber: {
          code: '+' + number.countryCallingCode,
          number: number.nationalNumber
        },
        birthDate: values.birthDate,
        password: values.password
      })

      await fetchPOST('/auth/register-customer', body)

      navigate('/login')
    } catch (error) {
      console.error(error)
      setRegisterError('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
      setRequestLoading(false)
    }
  }

  return (
    <div className="h-full w-full bg-[url('/src/assets/images/bg.png')] bg-cover">
      <div className="login-gradient flex h-full w-full items-center justify-center bg-opacity-20">
        <div className="flex pb-12 w-[600px] items-center rounded-lg border-2 border-white bg-black bg-opacity-60 shadow-2xl backdrop-blur-md">
          <div className="transition-wrapper flex h-full w-full flex-col items-center justify-center gap-8 rounded-r-lg">
            <Formik
              id="userRegister-formik"
              initialValues={initialValues}
              validationSchema={userRegisterSchema}
              onSubmit={handleSubmit}
            >
              {formik => (
                <Form className="w-full h-full mt-[10%]">
                  <div className="form-container h-full flex flex-col items-center gap-4">
                    <CSSTransition
                      in={activeStep === 1}
                      timeout={500}
                      classNames="menu-primary"
                      unmountOnExit
                    >
                      <div className="flex w-full flex-col items-center gap-4">
                        <h1 className="font-mont-md text-xl font-semibold text-white">
                          {t('auth.register')}
                        </h1>
                        <div className="flex w-full flex-col items-center gap-4">
                          <Field
                            type="text"
                            id="login"
                            name="login"
                            label="LOGIN"
                            variant="standard"
                            helperText={
                              formik.errors.login &&
                              formik.touched.login &&
                              formik.errors.login
                            }
                            className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${
                              !(formik.errors.login && formik.touched.login)
                                ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                                : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                            }`}
                            color="primary"
                            as={TextField}
                          />
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            label="EMAIL"
                            variant="standard"
                            helperText={
                              formik.errors.email &&
                              formik.touched.email &&
                              formik.errors.email
                            }
                            className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${
                              !(formik.errors.email && formik.touched.email)
                                ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                                : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                            }`}
                            color="primary"
                            as={TextField}
                          />
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            label={t('auth.passwordCAP')}
                            variant="standard"
                            helperText={
                              formik.errors.password &&
                              formik.touched.password &&
                              formik.errors.password
                            }
                            className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${
                              !(
                                formik.errors.password &&
                                formik.touched.password
                              )
                                ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                                : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                            }`}
                            color="primary"
                            as={TextField}
                          />
                          <Field
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            label={t('auth.confirmPasswordCAP')}
                            variant="standard"
                            helperText={
                              formik.errors.confirmPassword &&
                              formik.touched.confirmPassword &&
                              formik.errors.confirmPassword
                            }
                            className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${
                              !(
                                formik.errors.confirmPassword &&
                                formik.touched.confirmPassword
                              )
                                ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                                : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                            }`}
                            color="primary"
                            as={TextField}
                          />
                          <div className="flex w-4/5 gap-5">
                            <Link
                              id="login-registered-link"
                              to="/login"
                              className="pointer flex h-[50px] w-4/5 items-center justify-center rounded-lg bg-primary font-mont-md text-white shadow-md"
                            >
                              {t('auth.backToLogin')}
                            </Link>
                            <button
                              type="button"
                              onClick={() => setActiveStep(2)}
                              disabled={
                                !(
                                  !formik.errors.login &&
                                  formik.touched.login &&
                                  !formik.errors.email &&
                                  formik.touched.email &&
                                  !formik.errors.password &&
                                  formik.touched.password &&
                                  !formik.errors.confirmPassword &&
                                  formik.touched.confirmPassword
                                )
                              }
                              className={`pointer flex h-[50px] w-4/5 items-center justify-center rounded-lg shadow-md ${
                                !(
                                  !formik.errors.login &&
                                  formik.touched.login &&
                                  !formik.errors.email &&
                                  formik.touched.email &&
                                  !formik.errors.password &&
                                  formik.touched.password &&
                                  !formik.errors.confirmPassword &&
                                  formik.touched.confirmPassword
                                )
                                  ? 'bg-grey-1 text-grey-2'
                                  : 'bg-primary text-white'
                              }`}
                            >
                              {t('auth.next')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CSSTransition>

                    <CSSTransition
                      in={activeStep === 2}
                      timeout={500}
                      classNames="menu-secondary"
                      unmountOnExit
                    >
                      <div className="flex w-full flex-col items-center gap-4">
                        <h1 className="font-mont-md text-xl font-semibold text-white">
                          {t('auth.register')}
                        </h1>
                        <Field
                          type="text"
                          id="firstName"
                          name="firstName"
                          label={t('auth.firstNameCAP')}
                          variant="standard"
                          helperText={
                            formik.errors.firstName &&
                            formik.touched.firstName &&
                            formik.errors.firstName
                          }
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${
                            !(
                              formik.errors.firstName &&
                              formik.touched.firstName
                            )
                              ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                              : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                          }`}
                          color="primary"
                          as={TextField}
                        />
                        <Field
                          type="text"
                          id="lastName"
                          name="lastName"
                          label={t('auth.lastNameCAP')}
                          variant="standard"
                          helperText={
                            formik.errors.lastName &&
                            formik.touched.lastName &&
                            formik.errors.lastName
                          }
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${
                            !(formik.errors.lastName && formik.touched.lastName)
                              ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                              : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                          }`}
                          color="primary"
                          as={TextField}
                        />

                        <Field
                          as={MuiPhoneNumber}
                          className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                            !(
                              formik.errors.phoneNumber &&
                              formik.touched.phoneNumber
                            )
                              ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                              : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                          }`}
                          label={t('auth.phoneMuberCAP')}
                          helperText={
                            formik.errors.phoneNumber &&
                            formik.touched.phoneNumber &&
                            formik.errors.phoneNumber
                          }
                          defaultCountry="pl"
                          id="userRegister-phoneNumber-field"
                          name={'phoneNumber'}
                          value={formik.values.phoneNumber}
                          onChange={(value: string) =>
                            formik.setFieldValue('phoneNumber', value)
                          }
                        />

                        <Field
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          label={t('auth.birthDateCAP')}
                          variant="standard"
                          helperText={
                            formik.errors.birthDate &&
                            formik.touched.birthDate &&
                            formik.errors.birthDate
                          }
                          className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                            !(
                              formik.errors.birthDate &&
                              formik.touched.birthDate
                            )
                              ? '[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary'
                              : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                          }`}
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              color:
                                formik.errors.birthDate &&
                                formik.touched.birthDate
                                  ? '#f44336'
                                  : '#fff'
                            }
                          }}
                          InputProps={{
                            style: {
                              color: '#fff'
                            }
                          }}
                          color="primary"
                          as={TextField}
                        />

                        <div className="flex w-4/5 gap-5">
                          <button
                            type="button"
                            onClick={() => setActiveStep(1)}
                            className={`pointer flex h-[50px] w-4/5 items-center justify-center rounded-lg bg-primary text-white shadow-md`}
                          >
                            {t('auth.back')}
                          </button>
                          <button
                            type="submit"
                            disabled={!formik.isValid || requestLoading}
                            className={`pointer flex h-[50px] w-4/5 items-center justify-center rounded-lg shadow-md ${
                              formik.isValid
                                ? 'bg-primary text-white'
                                : 'bg-grey-1 text-grey-2'
                            }`}
                          >
                            {requestLoading ? (
                              <CircularProgress color="secondary" />
                            ) : (
                              `${t('auth.submit')}`
                            )}
                          </button>
                        </div>
                      </div>
                    </CSSTransition>

                    {registerError && (
                      <div className="mt-2 font-mont-md text-[15px] text-error">
                        {registerError}
                      </div>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
