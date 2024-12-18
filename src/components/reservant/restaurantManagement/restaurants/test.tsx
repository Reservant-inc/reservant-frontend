import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, InputLabel, Select, MenuItem, FormHelperText, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, NativeSelect } from '@mui/material';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { GroupType, RestaurantType } from '../../../../services/types';
import { LocalType } from '../../../../services/enums';
import { useTranslation } from 'react-i18next';
import { fetchFilesPOST, fetchGET, getImage } from '../../../../services/APIconn';
import DefaultImage from '../../../../assets/images/user.jpg';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface RestaurantDetailsProps {
  restaurant: RestaurantType;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groups: GroupType[];
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant, open, onClose, onSuccess, groups }) => {
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
  });

  const [tags, setTags] = useState<string[]>([])
  const [logoPath, setLogoPath] = useState<string>(restaurant.logo|| DefaultImage);
  const [photos, setPhotos] = useState<string[]>(restaurant.photos || []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);


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
  const timeOptions = generateTimeOptions();

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
      const res = await fetchFilesPOST('/uploads', logoFile);
      setLogoPath(res.path);
      return res.fileName;
    } catch (error) {
      console.error('Error uploading logo:', error);
      setErrorMessage('Failed to upload logo. Please try again.');
      return null;
    }
  };

  const uploadPhoto = async (photoFile: File) => {
    try {
      const res = await fetchFilesPOST('/uploads', photoFile); // zakładamy, że jest to funkcja do przesyłania pliku
      setPhotos(prev => [...prev, res.path]); // Dodajemy nowe zdjęcie do stanu
      return res.fileName;
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMessage('Failed to upload photo. Please try again.');
      return null;
    }
  };

  
  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    setSubmitting(true);

    try {
      console.log('Form submitted:', values);
      // You would send data to the server here
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
            maxReservationDurationMinutes: restaurant.maxReservationDurationMinutes,
            provideDelivery: restaurant.provideDelivery,
            description: restaurant.description, 
            tags: restaurant.tags,
            openingHours: restaurant.openingHours, 
            logo: restaurant.logo, 
            photos: restaurant.photos,
            isVerified: restaurant.isVerified
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {formik => (
            <Form>
                {/* pozostałe pola */}

                <div className="mb-4">
                  <label htmlFor="openingHours" className="block text-sm font-medium dark:text-grey-2">
                    Opening Hours
                  </label>
                  <div className="border border-grey-15 dark:border-grey-2 rounded p-4 hover:border-black">
                  <FieldArray name="openingHours">
                    {({ push, remove }) => (
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
                  </div>
                </div>

              {/* Logo Preview and Upload Button */}
                <div className="mb-4">
                  <label htmlFor="logo" className="block text-sm font-medium dark:text-grey-2">
                    Logo
                  </label>
                  <div className="border border-grey-15 dark:border-grey-2 rounded p-4 hover:border-black">
                    {/* Logo image display */}
                    <div className="flex items-center justify-start gap-4">
                      <img
                        className="w-32 h-32 object-cover rounded-lg" // Zwiększenie rozmiaru logo
                        src={logoPath === DefaultImage ? DefaultImage : getImage(logoPath, logoPath)}
                        alt="Logo preview"
                      />
                    </div>

                    {/* Upload button */}
                    <div className="mt-4 flex justify-start">
                      <label htmlFor={`logo-upload`} className="cursor-pointer text-primary dark:text-secondary">
                          <CloudUploadIcon /> Upload Logo
                        </label>
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const fileName = await uploadLogo(e.target.files[0]);
                            formik.setFieldValue('logo', fileName);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Preview and Upload Button for multiple photos */}
                <div className="mb-4">
                  <label htmlFor="photos" className="block text-sm font-medium dark:text-grey-2">
                    Photos
                  </label>
                  <div className="border border-grey-15 dark:border-grey-2 rounded p-4 hover:border-black">
                    <FieldArray name="photos">
                      {({ push, remove }) => (
                        <div className="flex flex-wrap gap-4 overflow-x-auto"> {/* Wrapping photos in one row with scroll */}
                          {/* Wyświetlanie zdjęć */}
                          {photos.length === 0 && <p>No photos uploaded yet</p>}
                          {photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                className="w-32 h-32 object-cover rounded-lg" // Wyświetlanie zdjęć w jednym rzędzie
                                src={photo ? getImage(photo, photo) : DefaultImage}
                                alt={`Uploaded photo ${index + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-0 right-0 p-1 bg-black text-white rounded-full"
                              >
                                X
                              </button>
                            </div>
                          ))}
                          {/* Input to upload new photos */}
                          <div className='w-full'>
                            <label htmlFor={`photos-upload`} className="cursor-pointer text-primary dark:text-secondary">
                              <CloudUploadIcon /> Upload More Photos
                            </label>
                            <input
                              type="file"
                              id="photos-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  const file = e.target.files[0];
                                  const fileName = await uploadPhoto(file);
                                  if (fileName) {
                                    push(fileName); // Dodajemy zdjęcie do formularza
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>


              <div className="flex justify-end space-x-4">
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
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantDetails;
