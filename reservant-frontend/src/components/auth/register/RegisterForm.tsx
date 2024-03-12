import React, { useState, useEffect } from "react"
import RegisterValidator from "../register/RegisterValidator";
import './RegisterForm.css';

interface UserProps {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
    birthDate: string,
    password: string,
}

interface onSubmitProps {
    user: UserProps,
    link: string,
    validate: () => boolean;
}

interface RegisterFormProps {
    onSubmit: ({ user, link, validate }: onSubmitProps) => void
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [birthDate, setBirthDate] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [passwordRepeated, setPasswordRepeated] = useState<string>("");

    const [messages, setMessages] = useState<string[]>([]);
    const [check, setCheck] = useState<boolean>(true);

    //funkcja odpowiadająca za przesłanie danych rejestrowanego klienta
    const submitUser = () => {
        onSubmit({
            user:
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                birthDate: birthDate,
                password: password
            },
            link: 'http://172.21.40.127/POST/auth/register-customer',
            validate: validate
        })
    }

    //funkcja odpowiadająca za przesłanie danych rejestrowanego właściciela
    const submitOwner = () => {
        onSubmit({
            user:
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                birthDate: birthDate,
                password: password
            },
            link: 'http://172.21.40.127/POST/auth/register-restaurant-owner',
            validate: validate
        })
    }

    const validate = (): boolean => {
        setMessages([])
        console.log(messages)
        setCheck(true)
        if (!(firstName.trim().length > 0)) {
            setMessages([...messages, `pole "imię" nie może być puste`])
            setCheck(false)
        }
        if (lastName.trim().length === 0) {
            setMessages([...messages, `pole "nazwisko" nie może być puste`])
            setCheck(false)
        }
        if (birthDate.length === 0) {
            setMessages([...messages, `pole "data urodzenia" nie może być puste`])
            setCheck(false)
        }
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            setMessages([...messages, `podany e-mail jest niepoprawny`])
            setCheck(false)
        }
        if (phoneNumber.length != 9) {
            setMessages([...messages, `numer telefonu jest niepoprawny`])
            setCheck(false)
        }
        if (password != passwordRepeated) {
            setMessages([...messages, `podane hasła muszą być zgodne`])
            setCheck(false)
        }
        if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
            setMessages([...messages, `pole "hasło" musi zawierać: 8 znaków, w tym 1 duża litera, 1 mała litera i 1 cyfra`])
            setCheck(false)
        }
        if (check)
            return true;
        return false;
    }

    return (
        <div className="registerForm">
            <h1>Rejestracja</h1>

            {/* <RegisterValidator messages={messages}/> */}

            <div className="registerInput">
                <label htmlFor="name">Name:</label>
                <input id="name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>

            <div className="registerInput">
                <label htmlFor="surname">Surname:</label>
                <input id="surname" type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>

            <div className="registerInput">
                <label htmlFor="birthDate">Birth date:</label>
                <input id="birthDate" type="date" onChange={e => setBirthDate(e.target.value)} />
            </div>

            <div className="registerInput">
                <label htmlFor="email">E-mail:</label>
                <input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="registerInput">
                <label htmlFor="number">Phone number:</label>
                {/* typ można zmienić na text, trzeba tylko pamiętać wtedy o trim() przy walidacji */}
                <input id="number" type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            </div>

            <div className="registerInput">
                <label htmlFor="password">Password:</label>
                <input id="password" type="text" value={password} onChange={e => setPassword(e.target.value)} />
            </div>


            <div className="registerInput">
                <label htmlFor="passwordRepeated">Repeat password:</label>
                <input id="passwordRepeated" type="text" value={passwordRepeated} onChange={e => setPasswordRepeated(e.target.value)} />
            </div>


            <div className="registerButtons">
                <input type="button" onClick={submitUser} value="Zarejestruj się" />
                {/* do ustalnia jeszcze gdzie wybieramy jako kto chce się ktoś rejestrować */}
                <input type="button" onClick={submitOwner} value="Zarejestruj się jako właściciel" />
            </div>


        </div>
    )
}