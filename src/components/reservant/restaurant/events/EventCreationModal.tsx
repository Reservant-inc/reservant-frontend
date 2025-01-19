import React, { useState } from 'react'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import {
  fetchPOST,
  fetchFilesPOST,
  getImage
} from '../../../../services/APIconn'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DefaultImage from '../../../../assets/images/no-image.png'
import { TextField, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ErrorMes from '../../../reusableComponents/ErrorMessage'
import DeleteIcon from '@mui/icons-material/Delete'

interface EventCreationModalProps {
  handleClose: () => void
  restaurantId: number
  onSuccess: (eventId: number) => void
}

interface EventFormValues {
  name: string
  description: string
  time: string
  mustJoinUntil: string
  maxPeople: number
  photoFileName: string | null
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1
})

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  handleClose,
  restaurantId,
  onSuccess
}) => {
  const [photoPath, setPhotoPath] = useState<string>(DefaultImage)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const [t] = useTranslation('global')

  const validationSchema = Yup.object({
    name: Yup.string().required(t('errors.event-creation.name.required')),
    description: Yup.string().required(
      t('errors.event-creation.description.required')
    ),
    time: Yup.string()
      .required(t('errors.event-creation.time.required'))
      .test('is-future', t('errors.event-creation.time.isFuture'), value => {
        return value ? new Date(value) > new Date() : false
      }),
    mustJoinUntil: Yup.string()
      .required(t('errors.event-creation.mustJoinUntil.required'))
      .test(
        'is-future',
        t('errors.event-creation.mustJoinUntil.isFuture'),
        value => {
          return value ? new Date(value) > new Date() : false
        }
      )
      .test(
        'is-before',
        t('errors.event-creation.mustJoinUntil.isBefore'),
        function (value) {
          const { time } = this.parent
          return value && time ? new Date(value) <= new Date(time) : true
        }
      ),
    maxPeople: Yup.number()
      .min(1, t('errors.event-creation.maxPeople.min'))
      .max(20, t('errors.event-creation.maxPeople.max'))
      .required(t('errors.event-creation.maxPeople.required')),
    photoFileName: Yup.string().required(
      t('errors.event-creation.photoFileName.required')
    )
  })

  const uploadPhoto = async (photoFile: File) => {
    try {
      const res = await fetchFilesPOST('/uploads', photoFile)
      setPhotoPath(res.path)
      return res.fileName
    } catch (error) {
      console.error('Error uploading photo:', error)
      return null
    }
  }

  const handleSubmit = async (
    values: EventFormValues,
    { setSubmitting, resetForm }: FormikHelpers<EventFormValues>
  ) => {
    setSubmitting(true)
    const body = JSON.stringify({
      restaurantId,
      name: values.name,
      description: values.description,
      time: values.time,
      mustJoinUntil: values.mustJoinUntil,
      maxPeople: values.maxPeople,
      photo: values.photoFileName || ''
    })

    try {
      const response = await fetchPOST('/events', body)
      resetForm()
      onSuccess(response.eventId)
    } catch (error: any) {
      setErrorMessage(error.message || 'An unknown error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full h-full bg-white dark:bg-black shadow-lg p-4 rounded-lg flex flex-col">
      <h2 id="modal-title" className="text-xl font-bold dark:text-white">
        {t('event-creation.create-event')}
      </h2>
      <div className="overflow-y-auto scroll justify-between py-3 px-2">
        <Formik<EventFormValues>
          initialValues={{
            name: '',
            description: '',
            time: '',
            mustJoinUntil: '',
            maxPeople: 1,
            photoFileName: 'null'
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, values, errors, touched }) => (
            <Form className="flex justify-center min-h-64">
              <div className="flex flex-col w-full gap-4">
                <div className="flex-col gap-2 flex">
                  <>
                    <div
                      className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                        errors.name && touched.name
                          ? 'border-error text-error'
                          : 'border-black text-black dark:text-grey-1 dark:border-white'
                      }`}
                    >
                      <label htmlFor="name">{t('event-creation.name')}:</label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className="w-full"
                      />
                    </div>
                    {errors.name && touched.name && (
                      <ErrorMes msg={errors.name} />
                    )}
                  </>
                  <>
                    <div
                      className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                        errors.description && touched.description
                          ? 'border-error text-error'
                          : 'border-black text-black dark:text-grey-1 dark:border-white'
                      }`}
                    >
                      <label htmlFor="description">
                        {t('event-creation.description')}:
                      </label>
                      <Field
                        type="text"
                        id="description"
                        name="description"
                        className="w-full"
                      />
                    </div>
                    {errors.description && touched.description && (
                      <ErrorMes msg={errors.description} />
                    )}
                  </>
                  <>
                    <div
                      className={`dark:[color-scheme:dark] flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                        errors.time && touched.time
                          ? 'border-error text-error'
                          : 'border-black text-black dark:text-grey-1 dark:border-white'
                      }`}
                    >
                      <label htmlFor="time">
                        {t('event-creation.time-from')}:
                      </label>
                      <Field
                        type="datetime-local"
                        id="time"
                        name="time"
                        className="w-full"
                      />
                    </div>
                    {errors.time && touched.time && (
                      <ErrorMes msg={errors.time} />
                    )}
                  </>
                  <>
                    <div
                      className={`dark:[color-scheme:dark] flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                        errors.mustJoinUntil && touched.mustJoinUntil
                          ? 'border-error text-error'
                          : 'border-black text-black dark:text-grey-1 dark:border-white'
                      }`}
                    >
                      <label htmlFor="mustJoinUntil">
                        {t('event-creation.must-join-until')}:
                      </label>
                      <Field
                        type="datetime-local"
                        id="mustJoinUntil"
                        name="mustJoinUntil"
                        className="w-full"
                      />
                    </div>
                    {errors.mustJoinUntil && touched.mustJoinUntil && (
                      <ErrorMes msg={errors.mustJoinUntil} />
                    )}
                  </>
                  <>
                    <div
                      className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                        errors.maxPeople && touched.maxPeople
                          ? 'border-error text-error'
                          : 'border-black text-black dark:text-grey-1 dark:border-white'
                      }`}
                    >
                      <label htmlFor="maxPeople">
                        {t('event-creation.max-people')}:
                      </label>
                      <Field
                        type="number"
                        id="maxPeople"
                        name="maxPeople"
                        className="w-full"
                      />
                    </div>
                    {errors.maxPeople && touched.maxPeople && (
                      <ErrorMes msg={errors.maxPeople} />
                    )}
                  </>
                  <>
                    <div>
                      <label
                        htmlFor="photo"
                        className={`block text-sm mb-2 ${
                          photoError
                            ? 'text-red'
                            : 'text-black dark:text-grey-1'
                        }`}
                      >
                        {t('event-creation.preview-picture')}:
                      </label>

                      <div
                        className="relative min-w-64 min-h-64 flex items-center justify-center"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <img
                          className="w-64 h-64 absolute rounded-lg"
                          src={
                            photoPath === DefaultImage
                              ? DefaultImage
                              : getImage(photoPath, photoPath)
                          }
                          alt="Event preview"
                        />
                        {isHovered && (
                          <div className="bg-semi-trans w-64 h-64 absolute flex flex-col items-center justify-center rounded-lg gap-2">
                            <label
                              htmlFor="photo"
                              className="shadow hover:cursor-pointer self-center h-10 w-48 flex justify-center items-center gap-1 rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary"
                            >
                              <CloudUploadIcon />
                              {t('event-creation.upload-photo')}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoPath(DefaultImage)
                                setFieldValue('photoFileName', null)
                                setPhotoError(
                                  t(
                                    'errors.event-creation.photoFileName.required'
                                  )
                                )
                              }}
                              className="shadow hover:cursor-pointer self-center h-10 w-48 flex justify-center items-center gap-1 rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-error text-error dark:hover:bg-error dark:hover:text-white hover:text-white hover:bg-error"
                            >
                              <DeleteIcon />
                              {t('event-creation.delete-photo')}
                            </button>
                          </div>
                        )}
                        <VisuallyHiddenInput
                          type="file"
                          id="photo"
                          accept="image/*"
                          onChange={async e => {
                            if (e.target.files && e.target.files.length > 0) {
                              const fileName = await uploadPhoto(
                                e.target.files[0]
                              )
                              setFieldValue('photoFileName', fileName)
                              setPhotoError(null)
                            }
                          }}
                        />
                      </div>
                      {photoError && <ErrorMes msg={photoError} />}
                    </div>
                  </>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 py-2 bg-white text-primary transition"
                  >
                    {t('event-creation.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !values.photoFileName ||
                      values.photoFileName === 'null' ||
                      !values.name ||
                      !values.description ||
                      !values.time ||
                      !values.mustJoinUntil ||
                      !values.maxPeople ||
                      Object.keys(errors).length > 0
                    }
                    className={`text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 py-2 bg-white text-primary transition ${
                      isSubmitting ||
                      !values.photoFileName ||
                      values.photoFileName === 'null' ||
                      !values.name ||
                      !values.description ||
                      !values.time ||
                      !values.mustJoinUntil ||
                      !values.maxPeople ||
                      Object.keys(errors).length > 0
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isSubmitting
                      ? t('event-creation.saving')
                      : t('event-creation.create')}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default EventCreationModal
