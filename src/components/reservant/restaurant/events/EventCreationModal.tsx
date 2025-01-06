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

const validationSchema = Yup.object({
  name: Yup.string().required('Event Name is required'),
  description: Yup.string().required('Description is required'),
  time: Yup.string().required('Event Time is required'),
  mustJoinUntil: Yup.string().required('Must Join Until is required'),
  maxPeople: Yup.number()
    .min(1, 'Must be at least 1')
    .required('Max People is required')
})

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
      <h2 id="modal-title" className="text-xl font-bold mb-4 dark:text-white">
        Create Event
      </h2>
      <div className="overflow-y-auto scroll justify-between pr-3 pb-2">
      <Formik<EventFormValues>
        initialValues={{
          name: '',
          description: '',
          time: '',
          mustJoinUntil: '',
          maxPeople: 1,
          photoFileName: null
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

            {/* Podgląd zdjęcia i przycisk przesyłania */}
              <div className="mb-4">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium dark:text-grey-2 mb-2"
                >
                  Event preview picture
                </label>
                <div
                  className="relative min-w-64 min-h-64 flex items-center justify-center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    className="w-64 h-64 absolute rounded-lg"
                    src={photoPath === DefaultImage ? DefaultImage : getImage(photoPath, photoPath)}
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
                  <VisuallyHiddenInput
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={async e => {
                      if (e.target.files && e.target.files.length > 0) {
                        const fileName = await uploadPhoto(e.target.files[0])
                        setFieldValue('photoFileName', fileName)
                      }
                    }}
                  />
                </div>
              </div>
            {errorMessage && (
              <p className="mb-4 text-red-500">{errorMessage}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
      </div>
    </div>
  )
}

export default EventCreationModal
