import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

    const navigate = useNavigate();

    const [t] = useTranslation("global")

    //navigation to registration
    const handleRegisterClick = () => {
        navigate("/auth/register");
    };

    //navigation to login
    const handleLoginClick = () => {
        navigate("/auth/login");
    };
    return (
        <>
            <h1>Reservant</h1>
            <button onClick={handleRegisterClick}>Zarejestruj się</button>
            <button onClick={handleLoginClick}>Zaloguj się</button>
        </>
    )
}

export default LandingPage