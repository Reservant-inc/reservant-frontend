import React from "react";
import RegisterForm from './RegisterForm';

interface UserProps {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
    birthDate: string,
    password: string,
}

interface RegisterProps {
    updateStatus: () => void
}

interface onSubmitProps {
    user: UserProps,
    link: string,
    validate: () => boolean;
}

export default function Register ({updateStatus}: RegisterProps) {
    
    //template przesyłania danych rejestrowanego aktora
    const onSubmit = ({user, link, validate}:  onSubmitProps) => {
        // if(validate())
        {
            fetch(link, {
                method: 'POST',
                body: JSON.stringify({
                    user
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then((json) => console.log(json))
            
            updateStatus();
        }
    }
    
    return (
        <div className="Register">
            <RegisterForm onSubmit={onSubmit}/>
        </div>
    )
}