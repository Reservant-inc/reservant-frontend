import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Home () {

    const navigate = useNavigate();

    const [t, i18n] = useTranslation("global")

    //navigation to registration
    const handleRegisterClick = () => {
        navigate("/register");
    };

    //navigation to login
    const handleLoginClick = () => {
        navigate("/login");
    };
    return (
        <>
            <h1>Reservant</h1>
            <button onClick={handleRegisterClick}>Zarejestruj się</button>
            <button onClick={handleLoginClick}>Zaloguj się</button>
        </>
    )
}