import React, { useState } from "react";
import RestaurantRegister, { RestaurantProps } from "./RestaurantRegister";
import './RestaurantRegister.css';


interface onSubmitProps {
    restaurant: RestaurantProps,
    link: string,
}

interface RestaurantRegisterFormProps {
    onSubmit: ({ restaurant, link }: onSubmitProps) => void
}

export default function RestaurantRegisterForm({ onSubmit }: RestaurantRegisterFormProps) {
    //TODO: get owner data from logged user
    const owner = {
        firstName: "Jan",
        lastName: "Kowalski"
    }

    //TODO: fetch bussiness types from server

    const businessTypes = [
        {
            id: 1,
            name: "abc"
        },
        {
            id: 2,
            name: "def"
        }
    ]

    const [name, setName] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [streetNo, setStreetNo] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [postalCode, setPostalCode] = useState<string>("");
    const [apartmentNo, setApartmentNo] = useState<string>("");
    const [nip, setNip] = useState<string>("");
    const [businessType, setBusinessType] = useState<number>(0);
    const [localArea, setLocalArea] = useState<string>("");
    const [premisesLeaseAgreement, setPremisesLeaseAgreement] = useState<File>();
    const [alcoholLicense, setAlcoholLicense] = useState<File>();
    const [businessConductConsent, setBusinessConductConsent] = useState<File>();

    const [check, setCheck] = useState<boolean>(true);

    //function responsible for sending data of customer being registered
    const submitRestaurant = () => {
        onSubmit({
            restaurant:
            {
                name: name,
                street: street,
                streetNo: streetNo,
                city: city,
                postalCode: postalCode,
                apartmentNo: apartmentNo,
                nip: nip,
                businessType: businessType,
                localArea: localArea,
                premisesLeaseAgreement: premisesLeaseAgreement,
                alcoholLicense: alcoholLicense,
                businessConductConsent: businessConductConsent
            },
            link: 'http://172.21.40.127/restaurants',
        })
    }

    return (
        <div className="restaurantRegisterForm">
            <h1>Restaurant Register</h1>
            <label htmlFor="name">Name*</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} />

            <label htmlFor="street">Street*</label>
            <input id="street" type="text" value={street} onChange={e => setStreet(e.target.value)} />

            <label htmlFor="city">City*</label>
            <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} />

            <label htmlFor="postalCode">Postal code*</label>
            <input id="postalCode" type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} />

            <label htmlFor="apartmentNo">Apartment No</label>
            <input id="apartmentNo" type="text" value={apartmentNo} onChange={e => setApartmentNo(e.target.value)} />

            <label htmlFor="nip">NIP*</label>
            <input id="nip" type="text" value={nip} onChange={e => setNip(e.target.value)} />

            <label htmlFor="businessType">Business Type*</label>
            <select name="businessType" id="businessType" onChange={e => setBusinessType(parseInt(e.target.value))}>
                {businessTypes.map((businessType) => (
                    <option value={businessType.id}>{businessType.name}</option>
                ))}
            </select>


            <label htmlFor="localArea">Local Area*</label>
            <input id="localArea" type="text" value={localArea} onChange={e => setLocalArea(e.target.value)} />

            <label htmlFor="premisesLeaseAgreement">Premises Lease Agreement</label>
            <input id="premisesLeaseAgreement" type="file" onChange={e => setPremisesLeaseAgreement(e.target.files![0])} />

            <label htmlFor="alcoholLicense">Alcohol License</label>
            <input id="alcoholLicense" type="file" onChange={e => setAlcoholLicense(e.target.files![0])} />

            <label htmlFor="businessConductConsentt">Business Conduct Consent</label>
            <input id="businessConductConsent" type="file" onChange={e => setBusinessConductConsent(e.target.files![0])} />

            <input type="button" onClick={submitRestaurant} value="Register"></input>

        </div>
    )
}