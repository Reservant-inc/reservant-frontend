import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from '@mui/material'
import { Formik, Field, Form } from 'formik'
import { FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { fetchFilesPOST, fetchPUT } from '../../../../services/APIconn' // Assuming fetchPUT is implemented in your API service
import { EventDataType } from '../../../../services/types'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { getImage } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/user.jpg'
import { useTranslation } from 'react-i18next'

interface EventEditDialogProps {
  open: boolean
  onClose: () => void
  event: EventDataType
  onSuccess: () => void
}

const EventEditDialog: React.FC<EventEditDialogProps> = ({
  open,
  onClose,
  event,
  onSuccess
}) => {
  const [photoPath, setPhotoPath] = useState<string>(
    event.photo || DefaultImage
  )
  const [isHovered, setIsHovered] = useState(false)

  const { t } = useTranslation('global')

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('errors.event-creation.name.required'))
      .trim()
      .min(1, t('errors.event-creation.name.required'))
      .max(50, t('errors.event-creation.name.max')),
    description: Yup.string()
      .required(t('errors.event-creation.description.required'))
      .trim()
      .min(1, t('errors.event-creation.description.required'))
      .max(200, t('errors.event-creation.description.max')),
    time: Yup.string()
      .required(t('errors.event-creation.time.required'))
      .test('is-future', t('errors.event-creation.time.isFuture'), value => {
        return new Date(value) > new Date() // Sprawdza, czy data jest późniejsza niż dzisiaj
      }),
    mustJoinUntil: Yup.string()
      .required(t('errors.event-creation.mustJoinUntil.required'))
      .test(
        'is-future',
        t('errors.event-creation.mustJoinUntil.isFuture'),
        value => {
          return new Date(value) > new Date() // Sprawdza, czy data jest późniejsza niż dzisiaj
        }
      )
      .test(
        'is-after-time',
        t('errors.event-creation.mustJoinUntil.isBefore'),
        function (value) {
          const { time } = this.parent
          return new Date(value) < new Date(time) // Sprawdza, czy `mustJoinUntil` jest po `time`
        }
      ),
    maxPeople: Yup.number()
      .min(1, t('errors.event-creation.maxPeople.min'))
      .max(20, t('errors.event-creation.maxPeople.max'))
      .required(t('errors.event-creation.maxPeople.required')),
    photo: Yup.string().required(
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
    values: any,
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    setSubmitting(true)

    const body = JSON.stringify({
      restaurantId: values.restaurantId,
      name: values.name,
      description: values.description,
      time: values.time,
      mustJoinUntil: values.mustJoinUntil,
      maxPeople: values.maxPeople,
      photo: values.photo ? values.photo.replace(/^\/uploads\//, '') : ''
    })
    try {
      const response = await fetchPUT(`/events/${values.eventId}`, body)
      resetForm()
      onSuccess()
    } catch (error: any) {
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="flex justify-between items-center font-bold border-b dark:bg-grey-6 border-grey-1 dark:text-white">
        <span>{t('event-creation.edit-event')}</span>
        <button onClick={onClose} className="text-grey-2">
          <CloseSharpIcon />
        </button>
      </DialogTitle>
      <DialogContent className="scroll dark:bg-grey-6 ">
        <Formik
          initialValues={{
            name: event.name,
            description: event.description,
            time: new Date(event.time).toISOString().slice(0, 16),
            mustJoinUntil: new Date(event.mustJoinUntil)
              .toISOString()
              .slice(0, 16),
            maxPeople: event.maxPeople,
            photo: event?.photo,
            restaurantId: event.restaurant.restaurantId,
            eventId: event.eventId
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {formik => (
            <Form>
              <div className="py-4">
                <div className="mb-4">
                  <Field
                    type="text"
                    variant="standard"
                    label={t('event-creation.name')}
                    as={TextField}
                    name="name"
                    id="name"
                    fullWidth
                    className={`w-full [&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                      !(formik.errors.name && formik.touched.name)
                        ? '[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary dark:[&>*]:before:border-white'
                        : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                    }`}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </div>
                <div className="mb-4">
                  <Field
                    type="text"
                    variant="standard"
                    label={t('event-creation.description')}
                    fullWidth
                    as={TextField}
                    name="description"
                    id="description"
                    className={`w-full [&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                      !(formik.errors.description && formik.touched.description)
                        ? '[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary dark:[&>*]:before:border-white'
                        : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                    }`}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                </div>
                <div className="mb-4">
                  <Field
                    variant="standard"
                    label={t('event-creation.time-from')}
                    as={TextField}
                    name="time"
                    type="datetime-local"
                    id="time"
                    fullWidth
                    className={`w-full dark:[color-scheme:dark] [&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                      !(formik.errors.time && formik.touched.time)
                        ? '[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary dark:[&>*]:before:border-white'
                        : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                    }`}
                    error={formik.touched.time && Boolean(formik.errors.time)}
                    helperText={formik.touched.time && formik.errors.time}
                  />
                </div>
                <div className="mb-4">
                  <Field
                    variant="standard"
                    label={t('event-creation.must-join-until')}
                    as={TextField}
                    name="mustJoinUntil"
                    type="datetime-local"
                    id="mustJoinUntil"
                    fullWidth
                    className={`w-full dark:[color-scheme:dark] [&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                      !(
                        formik.errors.mustJoinUntil &&
                        formik.touched.mustJoinUntil
                      )
                        ? '[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary dark:[&>*]:before:border-white'
                        : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                    }`}
                    error={
                      formik.touched.mustJoinUntil &&
                      Boolean(formik.errors.mustJoinUntil)
                    }
                    helperText={
                      formik.touched.mustJoinUntil &&
                      formik.errors.mustJoinUntil
                    }
                  />
                </div>
                <div className="mb-4">
                  <Field
                    variant="standard"
                    label={t('event-creation.max-people')}
                    as={TextField}
                    name="maxPeople"
                    type="number"
                    id="maxPeople"
                    fullWidth
                    className={`w-full [&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:dark:text-white ${
                      !(formik.errors.maxPeople && formik.touched.maxPeople)
                        ? '[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary dark:[&>*]:before:border-white'
                        : '[&>*]:text-error dark:[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                    }`}
                    error={
                      formik.touched.maxPeople &&
                      Boolean(formik.errors.maxPeople)
                    }
                    helperText={
                      formik.touched.maxPeople && formik.errors.maxPeople
                    }
                  />
                </div>

                {/* Photo Preview and Upload Button */}
                <div className="mb-4">
                  <label
                    htmlFor="photo"
                    className="block  w-4/5 font-mont-md text-[15px] dark:text-white mb-2"
                  >
                    {t('event-creation.preview-picture')}
                  </label>
                  <div
                    className="relative min-w-64 min-h-64 flex items-center justify-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img
                      className="w-64 h-64 absolute rounded-lg"
                      src={getImage(photoPath, DefaultImage)}
                      alt="Event preview"
                    />
                    {isHovered && (
                      <div className="bg-semi-trans w-64 h-64 absolute flex items-center justify-center rounded-lg">
                        <label
                          htmlFor="photo"
                          className="shadow hover:cursor-pointer self-center h-10 w-48 flex justify-center items-center gap-1 rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary"
                        >
                          <CloudUploadIcon />
                          {t('general.uploadPhoto')}
                        </label>
                      </div>
                    )}
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      className="hidden"
                      onChange={async e => {
                        if (e.target.files && e.target.files.length > 0) {
                          const fileName = await uploadPhoto(e.target.files[0])
                          formik.setFieldValue('photo', fileName)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                >
                  {t('general.saveChanges')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                >
                  {t('general.cancel')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default EventEditDialog
