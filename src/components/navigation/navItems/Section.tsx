import React from "react";
import { useNavigate } from "react-router-dom";
import { SectionProps } from "../../../services/interfaces";

const Section: React.FC<SectionProps> = ({ name, connString }) => {

    const navigate = useNavigate()

    return(
        <button onClick={() => navigate(connString)}>
            <h1>{name}</h1>
        </button>
    )
}

export default Section