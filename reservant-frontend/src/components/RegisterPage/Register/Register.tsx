import React from "react";
import RegisterForm from '../RegisterForm/RegisterForm';

interface UserProps {
    name: string,
    surname: string,
    password: string,
    birthDate: string,
    email: string,
    phoneNumber: string
}

interface RegisterProps {
    updateStatus: () => void
}

export default function Register ({updateStatus}: RegisterProps) {
    
    const onSubmit = (user: UserProps, link: string) => {
        fetch(link, {
            method: 'POST',
            body: JSON.stringify({
                name: user.name,
                surname: user.surname,
                password: user.password,
                birthDate: user.birthDate,
                email: user.email,
                phoneNumber: user.phoneNumber
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((json) => console.log(json));
        updateStatus();
    }
    
    return (
        <div className="Register">
            <RegisterForm onSubmit={onSubmit}/>
        </div>
    )
}