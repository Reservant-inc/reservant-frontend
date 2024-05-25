import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const [t] = useTranslation("global");

  return(

    <div className="flex flex-col items-center justify-center h-screen">
      <a href="http://localhost:3000/home" className="p-2">localhost</a> <br/>
      <a href="http://172.21.40.127:800/home" className="p-2">serwer</a>
    </div>
  ) 
};

export default LandingPage;
