import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const [t] = useTranslation("global");

  return (
    <div
      id="landingPageWrapper"
      className="flex h-screen flex-col items-center justify-center"
    >
      <a
        id="localhostLink"
        href="http://localhost:3000/reservant/home"
        className="p-2"
      >
        localhost
      </a>{" "}
      <br />
      <a id="serverLink" href="http://172.21.40.127:800/reservant/home" className="p-2">
        serwer
      </a>
    </div>
  );
};

export default LandingPage;
