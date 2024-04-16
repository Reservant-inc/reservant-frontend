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
  idCard: File | null; //
  businessPermission: string;
  rentalContract: string;
  alcoholLicense: string;
  tags: string[];
  provideDelivery: boolean;
  logo: File | null
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
    console.log("Przeszliśmy do kroku 2");
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
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("User not authenticated");
      }
    
      //idCard upload
      const formData = new FormData();
      if (data.idCard) { 
        formData.append("File", data.idCard);
      }

      const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      console.log("idCard uploaded successfully!");

      const responseData = await response.json();

      if (responseData && responseData.path) {
        const imagePath = responseData.path;
        console.log("Image path:", imagePath);
      } else {
        console.error("Path is undefined in responseData");
      }

  

      //logo upload
      const formData1 = new FormData();
      if (data.logo) { 
        formData1.append("File", data.logo);
      }

      const response1 = await fetch(`${process.env.REACT_APP_SERVER_IP}/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData1,
      });

      if (!response1.ok) {
        throw new Error("Failed to upload file");
      }

      console.log("logo uploaded successfully!");

      const responseData1 = await response1.json();

      if (responseData1 && responseData1.path) {
        const imagePath = responseData1.path;
        console.log("Image path:", imagePath);
      } else {
        console.error("Path is undefined in responseData");
      }

      console.log("Data to send: ", data);

      // Wysyłamy dane restauracji na serwer
      const restaurantResponse = await fetch(`${process.env.REACT_APP_SERVER_IP}/my-restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json();
        throw new Error(errorData.detail || "Failed to create restaurant");
      }
  
      console.log("Restaurant created successfully!");
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
