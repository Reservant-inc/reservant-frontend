import React from "react";

interface RegisterValidatorProps{
    messages: string[]
}

export default function RegisterValidator ({messages}: RegisterValidatorProps) {
    
    return (
        <div className="RegisterValidator">
            <p>
                {`${messages}`}
            </p>
        </div>
    )
}