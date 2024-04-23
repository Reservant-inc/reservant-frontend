import React, { useState } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import { RestaurantDataType } from "../../../services/types";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const RestaurantRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formDataStep1, setFormDataStep1] = useState<
    Partial<RestaurantDataType>
  >({});
  const [formDataStep2, setFormDataStep2] = useState<
    Partial<RestaurantDataType>
  >({});

  const { t } = useTranslation("global");

  const handleStep1Submit = (data: Partial<RestaurantDataType>) => {
    setFormDataStep1((prevData) => ({ ...prevData, ...data }));
    setStep(2);
  };

  const handleStep2Submit = (data: Partial<RestaurantDataType>) => {
    setFormDataStep2((prevData) => ({ ...prevData, ...data }));
    handleSubmit({ ...formDataStep1, ...data });
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (data: Partial<RestaurantDataType>) => {
    try {
      const dataToSend = { ...data };
      delete dataToSend.idCardFile;
      delete dataToSend.logoFile;
      delete dataToSend.businessPermissionFile;
      delete dataToSend.photosFile;
      delete dataToSend.rentalContractFile;
      delete dataToSend.alcoholLicenseFile;

      const filesToUpload: {
        name: keyof RestaurantDataType;
        key: keyof RestaurantDataType;
      }[] = [
        { name: "idCardFile", key: "idCard" },
        { name: "logoFile", key: "logo" },
        { name: "businessPermissionFile", key: "businessPermission" },
        { name: "rentalContractFile", key: "rentalContract" },
        { name: "alcoholLicenseFile", key: "alcoholLicense" },
      ];

      for (const { name, key } of filesToUpload) {
        const file = data[name] as File | null;
        if (file) {
          const formData = new FormData();
          formData.append("File", file);

          const response = await fetch(
            `${process.env.REACT_APP_SERVER_IP}/uploads`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}` as string,
              },
              body: formData,
            },
          );

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

          const response = await fetch(
            `${process.env.REACT_APP_SERVER_IP}/uploads`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}` as string,
              },
              body: photoFormData,
            },
          );

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

      console.log(dataToSend);
      const restaurantResponse = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/my-restaurants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}` as string,
          },
          body: JSON.stringify(dataToSend),
        },
      );

      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json();
        console.log(errorData);
        throw new Error(errorData.detail || "Failed to create restaurant");
      }

      console.log("upload successful");
    } catch (error) {
      console.error("Error while creating restaurant:", error);
    }
  };

  return (
    <div className="container-login">
      <h1 className="mb-8 text-center text-3xl font-bold">
        {t("restaurant-register.header")}
      </h1>
      {step === 1 && (
        <RegisterStep1
          onSubmit={handleStep1Submit}
          initialValues={formDataStep1}
        />
      )}
      {step === 2 && (
        <RegisterStep2 onSubmit={handleStep2Submit} onBack={handleBack} />
      )}
    </div>
  );
};

export default RestaurantRegister;
