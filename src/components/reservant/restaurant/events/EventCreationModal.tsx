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
  time: Yup.string()
    .required('Event Time is required')
    .test('is-future', 'Event Time must be in the future', (value) => {
      return value ? new Date(value) > new Date() : false
    }),
  mustJoinUntil: Yup.string()
    .required('Must Join Until is required')
    .test('is-future', 'Must Join Until must be in the future', (value) => {
      return value ? new Date(value) > new Date() : false
    })
    .test('is-before', 'Must Join Until time must start before the event', function (value) {
      const { time } = this.parent
      return value && time ? new Date(value) <= new Date(time) : true
    }),
  maxPeople: Yup.number()
    .min(1, 'Must be at least 1')
    .max(20, 'Cannot exceed 20 people')
    .required('Max People is required'),
  photoFileName: Yup.string().required('Photo is required'),
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
      <h2 id="modal-title" className="text-xl font-bold dark:text-white">
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
      photoFileName: null,
    }}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
  >
    {({ setFieldValue, isSubmitting, values, errors, touched, isValid, dirty }) => (
      <Form>
        <div className="flex flex-col gap-y-4">
          <div>
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

          <div>
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

          <div>
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

          <div>
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

          <div>
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

          <div>
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
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const fileName = await uploadPhoto(e.target.files[0])
                    setFieldValue('photoFileName', fileName)
                  }
                }}
              />
            </div>
          </div>

          {errorMessage && <p className="text-red">{errorMessage}</p>}

          <div className="flex justify-end gap-x-4">
            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty || !values.photoFileName}
              className={`text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 py-2 bg-white text-primary transition ${
                isSubmitting || !isValid || !dirty || !values.photoFileName
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 py-2 bg-white text-primary transition"
            >
              Cancel
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
