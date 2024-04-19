import React, { useState } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export interface RestaurantData {
  name: string;
  address: string;
  postalIndex: string;
  city: string;
  nip: string;
  restaurantType: string;
  idCardFile: File | null;
  idCard: string;
  businessPermissionFile: File | null;
  businessPermission: string; 
  rentalContractFile: File | null;
  rentalContract: string;
  alcoholLicenseFile: File | null;
  alcoholLicense: string;
  tags: string[];
  provideDelivery: boolean;
  logoFile: File | null;
  logo: string;
  photosFile: File[] | null;
  photos: string[];
  description: string;
  groupId: number | null; 
}

const RestaurantRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formDataStep1, setFormDataStep1] = useState<Partial<RestaurantData>>({});
  const [formDataStep2, setFormDataStep2] = useState<Partial<RestaurantData>>({});

  const { t } = useTranslation("global"); // Destructure t from the useTranslation hook

  const handleStep1Submit = (data: Partial<RestaurantData>) => {
    setFormDataStep1((prevData) => ({ ...prevData, ...data }));
    setStep(2);
  };

  const handleStep2Submit = (data: Partial<RestaurantData>) => {
    setFormDataStep2((prevData) => ({ ...prevData, ...data }));
    handleSubmit({ ...formDataStep1, ...data });
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (data: Partial<RestaurantData>) => {
    try {
      const dataToSend = { ...data };
      delete dataToSend.idCardFile;
      delete dataToSend.logoFile;
      delete dataToSend.businessPermissionFile;
      delete dataToSend.photosFile;
      delete dataToSend.rentalContractFile;
      delete dataToSend.alcoholLicenseFile;

      const filesToUpload: { name: keyof RestaurantData; key: keyof RestaurantData }[] = [
        { name: "idCardFile", key: "idCard" },
        { name: "logoFile", key: "logo" },
        { name: "businessPermissionFile", key: "businessPermission" },
        { name: "rentalContractFile", key: "rentalContract" },
        { name: "alcoholLicenseFile", key: "alcoholLicense" }
      ];
  
      for (const { name, key } of filesToUpload) {
        const file = data[name] as File | null;
        if (file) {
          const formData = new FormData();
          formData.append("File", file);
  
          const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/uploads`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}` as string,
            },
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error(`Failed to upload ${name}`);
          }
  
          const responseData = await response.json();
  
          if (responseData && responseData.fileName) {
            dataToSend[key] = responseData.fileName;
          } else {
            console.error(`Path is undefined in responseData for ${name}`);
          }
        }
      }

      // Initialize photos array if it's undefined
    dataToSend.photos = dataToSend.photos ?? [];

      // Loop through each photo file and upload it
    if (data.photosFile && data.photosFile.length > 0) {
      for (const photoFile of data.photosFile) {
        const photoFormData = new FormData();
        photoFormData.append("File", photoFile);

        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/uploads`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}` as string,
          },
          body: photoFormData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload photo file");
        }

        const responseData = await response.json();

        if (responseData && responseData.fileName) {
          dataToSend.photos.push(responseData.fileName);
        } else {
          console.error("Path is undefined in responseData");
        }
      }
    }

       console.log(dataToSend)
      const restaurantResponse = await fetch(`${process.env.REACT_APP_SERVER_IP}/my-restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}` as string,
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json();
        console.log(errorData)
        throw new Error(errorData.detail || "Failed to create restaurant");
      }

      console.log('upload successful')

    } catch (error) {
      console.error("Error while creating restaurant:", error);
    }
  };

  
  
  return (
    <div className="container-login">
      <h1 className="text-3xl text-center font-bold mb-8">{t("restaurant-register.header")}</h1>
      {step === 1 && <RegisterStep1 onSubmit={handleStep1Submit} initialValues={formDataStep1}/>}
      {step === 2 && <RegisterStep2 onSubmit={handleStep2Submit} onBack={handleBack} />}
    </div>
  );
};

export default RestaurantRegister;