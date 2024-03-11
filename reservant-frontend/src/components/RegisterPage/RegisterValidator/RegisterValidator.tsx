import React from "react";

interface RegisterValidatorProps{
    message: boolean
}

export default function RegisterValidator ({message}: RegisterValidatorProps) {
    
    return (
        <div className="RegisterValidator">
            <p>
                {message?"spełniono warunki":"nie spełniono warunków"}
            </p>
        </div>
    )
}