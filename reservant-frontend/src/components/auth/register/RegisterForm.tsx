import React, {useState, useEffect} from "react"

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
    onSubmit: ({user, link, validate}: onSubmitProps) => void
}

export default function RegisterForm ({onSubmit}: RegisterFormProps) {
    
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [birthDate, setBirthDate] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeated, setPasswordRepeated] = useState<string>("");

    const [firstNameMessage, setFirstNameMessage] = useState<string>("");
    const [lastNameMessage, setLastNameMessage] = useState<string>("");
    const [emailMessage, setEmailMessage] = useState<string>("");
    const [phoneNumberMessage, setPhoneNumberMessage] = useState<string>("");
    const [birthDateMessage, setBirthDateMessage] = useState<string>("");
    const [passwordMessage, setPasswordMessage] = useState<string>("");
    const [passwordRepeatedMessage, setPasswordRepeatedMessage] = useState<string>("");

    const [check, setCheck] = useState<boolean>(true);

    //function responsible for sending data of customer being registered
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

    //function responsible for sending data of restaurant owner being registered
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
    
    //function responsible for validating inputs, returns true if all inputs are valid
    const validate = (): boolean => {
        setCheck(true)
        if(!(firstName.trim().length > 0)){
            setFirstNameMessage("first name cannot be empty")
            setCheck(false)
        } else {
            setFirstNameMessage("")
        }
        if(!(lastName.trim().length > 0)){
            setLastNameMessage("last name cannot be empty")
            setCheck(false)
        } else {
            setLastNameMessage("")
        }
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            setEmailMessage("invalid e-mail")
            setCheck(false)
        } else {
            setEmailMessage("")
        }
        if(!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneNumber)){
            setPhoneNumberMessage("invalid phone number")
            setCheck(false)
        } else {
            setPhoneNumberMessage("")
        }
        if(birthDate.length===0){
            setBirthDateMessage("birth date cannot be empty")
            setCheck(false)
        } else {
            setBirthDateMessage("")
        }
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
            setPasswordMessage("invalid password")
            setCheck(false)
        } else {
            setPasswordMessage("")
        }
        if(password!=passwordRepeated){
            setPasswordRepeatedMessage("passwords must match")
            setCheck(false)
        } else {
            setPasswordRepeatedMessage("")
        }
        if(check)
            return true;
        return false;
    }

    return(
        <div className="RegisterForm">
            <h1>Rejestracja</h1>

            <label htmlFor="name">name:</label>
            <input id="name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
            <label htmlFor="name">{firstNameMessage}</label>

            <label htmlFor="surname">surname:</label>
            <input id="surname" type="text" value={lastName} onChange={e => setLastName(e.target.value)}/>
            <label htmlFor="surname">{lastNameMessage}</label>
            
            <label htmlFor="birthDate">birth date:</label>
            <input id="birthDate" type="date"  onChange={e => setBirthDate(e.target.value)}/>
            <label htmlFor="birthDate">{birthDateMessage}</label>
            
            <label htmlFor="email">e-mail:</label>
            <input id="email" type="text" value={email}  onChange={e => setEmail(e.target.value)}/>
            <label htmlFor="email">{emailMessage}</label>
            
            <label htmlFor="number">phone number:</label>
            <input id="number" type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
            <label htmlFor="number">{phoneNumberMessage}</label>
            
            <label htmlFor="password">password:</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <label htmlFor="password">{passwordMessage}</label>
            
            <label htmlFor="passwordRepeated">repeat password:</label>
            <input id="passwordRepeated" type="password" value={passwordRepeated} onChange={e => setPasswordRepeated(e.target.value)}/>
            <label htmlFor="passwordRepeated">{passwordRepeatedMessage}</label>
        
            <input type="button" onClick={submitUser} value="Zarejestruj się"/>
            {/* do ustalnia jeszcze gdzie wybieramy jako kto chce się ktoś rejestrować */}
            <input type="button" onClick={submitOwner} value="Zarejestruj się jako właściciel"/>
        </div>
    ) 
}