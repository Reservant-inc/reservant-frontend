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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validationSchema = Yup.object({
    name: Yup.string().required('Event Name is required'),
    description: Yup.string().required('Description is required'),
    time: Yup.string()
      .required('Event Time is required')
      .test('is-future', 'Event Time must be in the future', value => {
        return new Date(value) > new Date() // Sprawdza, czy data jest późniejsza niż dzisiaj
      }),
    mustJoinUntil: Yup.string()
      .required('Must Join Until is required')
      .test('is-future', 'Must Join Until must be in the future', value => {
        return new Date(value) > new Date() // Sprawdza, czy data jest późniejsza niż dzisiaj
      })
      .test(
        'is-after-time',
        'Must Join Until must be after Event Time',
        function (value) {
          const { time } = this.parent
          return new Date(value) < new Date(time) // Sprawdza, czy `mustJoinUntil` jest po `time`
        }
      ),
    maxPeople: Yup.number()
      .min(1, 'Must be at least 1')
      .required('Max People is required')
  })

  const uploadPhoto = async (photoFile: File) => {
    try {
      const res = await fetchFilesPOST('/uploads', photoFile)
      setPhotoPath(res.path)
      return res.fileName
    } catch (error) {
      console.error('Error uploading photo:', error)
      setErrorMessage('Failed to upload photo. Please try again.')
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
      setErrorMessage(error.message || 'An unknown error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ className: 'bg-white dark:bg-black' }}
    >
      <DialogTitle className="flex justify-between items-center font-bold border-b border-grey-1 dark:text-white">
        <span>Edit Event</span>
        <button onClick={onClose} className="text-grey-2">
          <CloseSharpIcon />
        </button>
      </DialogTitle>
      <DialogContent>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}{' '}
        {/* Display error message */}
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
          {({ setFieldValue, isSubmitting, values, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Event Name
                </label>
                <Field
                  as={TextField}
                  name="name"
                  id="name"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Description
                </label>
                <Field
                  as={TextField}
                  name="description"
                  id="description"
                  fullWidth
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="time"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Event Time
                </label>
                <Field
                  as={TextField}
                  name="time"
                  type="datetime-local"
                  id="time"
                  fullWidth
                  error={touched.time && Boolean(errors.time)}
                  helperText={touched.time && errors.time}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="mustJoinUntil"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Must Join Until
                </label>
                <Field
                  as={TextField}
                  name="mustJoinUntil"
                  type="datetime-local"
                  id="mustJoinUntil"
                  fullWidth
                  error={touched.mustJoinUntil && Boolean(errors.mustJoinUntil)}
                  helperText={touched.mustJoinUntil && errors.mustJoinUntil}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="maxPeople"
                  className="block text-sm font-medium dark:text-grey-2"
                >
                  Max People
                </label>
                <Field
                  as={TextField}
                  name="maxPeople"
                  type="number"
                  id="maxPeople"
                  fullWidth
                  error={touched.maxPeople && Boolean(errors.maxPeople)}
                  helperText={touched.maxPeople && errors.maxPeople}
                />
              </div>

              {/* Photo Preview and Upload Button */}
              <div className="mb-4">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium dark:text-grey-2 mb-2"
                >
                  Event Preview Picture
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
                    <div className="bg-semi-trans w-64 h-64 absolute flex items-center justify-center rounded-lg">
                      <label
                        htmlFor="photo"
                        className="shadow hover:cursor-pointer self-center h-10 w-48 flex justify-center items-center gap-1 rounded-lg p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary"
                      >
                        <CloudUploadIcon />
                        Upload photo
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
                        setFieldValue('photo', fileName)
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
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
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default EventEditDialog
