import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home () {
    const navigate = useNavigate();

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