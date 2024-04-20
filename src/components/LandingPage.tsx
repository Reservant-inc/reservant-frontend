import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const [t] = useTranslation("global");

  return <></>;
};

export default LandingPage;
