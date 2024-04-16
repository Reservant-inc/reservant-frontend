import React, { useState } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export interface RestaurantData {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  tin: string;
  businessType: string;
  id: File | null;
  tags: string[];
  provideDelivery: boolean;
  logo: File | null;
  photos: File | null;
  description: string;
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
    handleSubmit({ ...formDataStep1, ...data }); // Po zebraniu danych z kroku 2, wysyłamy wszystkie dane z kroków 1 i 2
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

      const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/my-restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log("Data to send: ", data);

      if (!response.ok) {
        const errorData = await response.json();
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
