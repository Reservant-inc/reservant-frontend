import React, {useState, useEffect} from "react"
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

    //alternatywnie string z komunikatem co do poprawy, prawdopodobnie bez useEffect wtedy
    const [message, setMessage] = useState<boolean>(false);

    //funkcja odpowiadająca za przesłanie danych rejestrowanego klienta
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

    //funkcja odpowiadająca za przesłanie danych rejestrowanego właściciela
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

    //w tym miejscu sprawdzamy przy każdej zmianie zawartości wylistowanych pól, czy wstępna walidacja została spełniona
    useEffect(() => {
        if(name.trim().length===0){
            setMessage(false)
        }
        else if(surname.trim().length===0){
            setMessage(false)
        }
        else if(birthDate.length===0){
            setMessage(false)
        }
        //nie wiem czy tu trim potrzebny, zostawiam żeby nie było przypału
        else if(email.trim().length===0){
            setMessage(false)
        }
        else if(phoneNumber.length===0){
            setMessage(false)
        }
        //warunki, które ma spełniać hasło, można dodać np min. ilość znaków albo jakiś regex
        else if(password!=passwordRepeated || password.trim().length===0){
            setMessage(false)
        }
        else{
            setMessage(true)
        }
    }, [name, surname, birthDate, email, phoneNumber, password, passwordRepeated, message])
    
    return(
        <div className="RegisterForm">
            <h1>Rejestracja</h1>

            <RegisterValidator message={message}/>

            <label htmlFor="name">imię:</label>
            <input id="name" type="text" value={name} placeholder="imię" onChange={e => setName(e.target.value)}/>
            
            <label htmlFor="surname">nazwisko:</label>
            <input id="surname" type="text" value={surname} placeholder="nazwisko" onChange={e => setSurname(e.target.value)}/>
            
            <label htmlFor="birthDate">data urodzenia:</label>
            <input id="birthDate" type="date" placeholder="data urodzenia" onChange={e => setBirthDate(e.target.value)}/>
            
            <label htmlFor="email">e-mail:</label>
            <input id="email" type="email" value={email} placeholder="e-mail" onChange={e => setEmail(e.target.value)}/>
            
            <label htmlFor="number">numer telefonu:</label>
            {/* typ można zmienić na text, trzeba tylko pamiętać wtedy o trim() przy walidacji */}
            <input id="number" type="number" value={phoneNumber} placeholder="numer telefonu" onChange={e => setPhoneNumber(e.target.value)}/>
            
            <label htmlFor="password">hasło:</label>
            <input id="password" type="text" value={password} placeholder="hasło" onChange={e => setPassword(e.target.value)}/>
            
            <label htmlFor="passwordRepeated">powtórz hasło:</label>
            <input id="passwordRepeated" type="text" value={passwordRepeated} placeholder="powtórz hasło" onChange={e => setPasswordRepeated(e.target.value)}/>
        
            <input type="button" onClick={submitUser} value="Zarejestruj się"/>
            {/* do ustalnia jeszcze gdzie wybieramy jako kto chce się ktoś rejestrować */}
            <input type="button" onClick={submitOwner} value="Zarejestruj się jako właściciel"/>

        </div>
    ) 
}