import React from "react";
import RestaurantRegisterForm from "./RestaurantRegisterForm";

export interface RestaurantProps {
    name: string,
    street: string,
    streetNo: string,
    city: string,
    postalCode: string,
    apartmentNo?: string,
    nip: string,
    //id is sent to server
    businessType: number,
    localArea: string,
    premisesLeaseAgreement?: File,
    alcoholLicense?: File,
    //optional because of usestate initial value
    businessConductConsent?: File
}

interface RestaurantRegisterProps {
    updateStatus: () => void
}

interface onSubmitProps {
    restaurant: RestaurantProps,
    link: string,
}

export default function RestaurantRegister({ updateStatus }: RestaurantRegisterProps) {

    //template of a function responsible for sending data of user being registered
    const onSubmit = ({ restaurant, link }: onSubmitProps) => {
        fetch(link, {
            method: 'POST',
            body: JSON.stringify({
                restaurant
            }),
            headers: {
                'Content-type': 'multipart/form-data; charset=UTF-8',
            },
        })
            .then((json) => console.log(json))

        updateStatus();
    }

    return (
        <div className="Register">
            <RestaurantRegisterForm onSubmit={onSubmit} />
        </div>
    )
}