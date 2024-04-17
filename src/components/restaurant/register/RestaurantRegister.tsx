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
  idCard: string | File;
  businessPermission: string; //required
  rentalContract: string | null;
  alcoholLicense: string | null;
  tags: string[];
  provideDelivery: boolean;
  logoFile: File | null;
  logo: string;
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

      //idCard upload
      const formData = new FormData();
      if (data.idCardFile) { 
        formData.append("File", data.idCardFile);
      }

      
      const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}` as string,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const responseData = await response.json();

      if (responseData && responseData.path) {
        const imagePath = responseData.path;
        dataToSend.idCard = imagePath;
      } else {
        console.error("Path is undefined in responseData");
      }

  

      //logo upload
      const formData1 = new FormData();
      if (data.logoFile) { 
        formData1.append("File", data.logoFile);
      }

      const response1 = await fetch(`${process.env.REACT_APP_SERVER_IP}/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}` as string,
        },
        body: formData1,
      });

      if (!response1.ok) {
        throw new Error("Failed to upload file");
      }


      const responseData1 = await response1.json();

      if (responseData1 && responseData1.path) {
        const imagePath = responseData1.path;
        dataToSend.logo = imagePath;
      } else {
        console.error("Path is undefined in responseData");
      }

      console.log(dataToSend)
      // Wysyłamy dane restauracji na serwer
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
      {step === 1 && <RegisterStep1 onSubmit={handleStep1Submit} />}
      {step === 2 && <RegisterStep2 onSubmit={handleStep2Submit} onBack={handleBack} />}
    </div>
  );
};

export default RestaurantRegister;
