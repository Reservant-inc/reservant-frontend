// RestaurantRegister.tsx
import React, { useState } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";

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

  const handleSubmit = (data: Partial<RestaurantData>) => {
    console.log("Dane do wysłania:", data);
    //send collected data on server
  };

  return (
    <div className="container-login">
      {step === 1 && <RegisterStep1 onSubmit={handleStep1Submit} />}
      {step === 2 && <RegisterStep2 onSubmit={handleStep2Submit} onBack={handleBack} />}
    </div>
  );
};

export default RestaurantRegister;
