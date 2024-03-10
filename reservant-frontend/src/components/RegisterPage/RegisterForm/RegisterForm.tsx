import React, {useState} from "react"
import RegisterValidator from "../RegisterValidator/RegisterValidator";

interface UserProps {
    name: string,
    surname: string,
    password: string,
    birthDate: string,
    email: string,
    phoneNumber: string
}

interface RegisterFormProps {
    onSubmit: (user: UserProps, link: string) => void
}

export default function RegisterForm ({onSubmit}: RegisterFormProps) {
    
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [birthDate, setBirthDate] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeated, setPasswordRepeated] = useState<string>("");

    const submitUser = () => {

        onSubmit({
            name: name,
            surname: surname,
            password: password,
            birthDate: birthDate,
            email: email,
            phoneNumber: phoneNumber
        }, 'http://172.21.40.127/POST/auth/register-customer');

    }

    const submitOwner = () => {

        onSubmit({
            name: name,
            surname: surname,
            password: password,
            birthDate: birthDate,
            email: email,
            phoneNumber: phoneNumber
        }, 'http://172.21.40.127/POST/auth/register-restaurant-owner');

    }

    return(
        <div className="RegisterForm">
            <h1>Rejestracja</h1>

            <RegisterValidator/>

            <label htmlFor="name">imię:</label>
            <input id="name" type="text" value={name} placeholder="imię" onChange={e => setName(e.target.value)}/>
            
            <label htmlFor="name">nazwisko:</label>
            <input id="surname" type="text" value={surname} placeholder="nazwisko" onChange={e => setSurname(e.target.value)}/>
            
            <label htmlFor="name">data urodzenia:</label>
            <input id="birthDate" type="date" placeholder="data urodzenia" onChange={e => setBirthDate(e.target.value)}/>
            
            <label htmlFor="name">e-mail:</label>
            <input id="email" type="email" value={email} placeholder="e-mail" onChange={e => setEmail(e.target.value)}/>
            
            <label htmlFor="name">numer telefonu:</label>
            <input id="number" type="number" value={phoneNumber} placeholder="numer telefonu" onChange={e => setPhoneNumber(e.target.value)}/>
            
            <label htmlFor="name">hasło:</label>
            <input id="password" type="text" value={password} placeholder="hasło" onChange={e => setPassword(e.target.value)}/>
            
            <label htmlFor="name">powtórz hasło:</label>
            <input id="passwordRepeated" type="text" value={passwordRepeated} placeholder="powtórz hasło" onChange={e => setPasswordRepeated(e.target.value)}/>
        
            <input type="button" onClick={submitUser} value="Zarejestruj się"/>
            <input type="button" onClick={submitOwner} value="Zarejestruj się jako właściciel"/>

        </div>
    ) 
}