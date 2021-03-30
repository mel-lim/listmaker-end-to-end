import React, { useState } from "react";
import { SignUpForm } from "../components/SignUpForm";
import { SuccessfulSignUp } from "../components/SuccessfulSignUp";

export const SignUp = () => {
    const [isSuccessfulRegistration, setIsSuccessfulRegistration] = useState(false);
    const [registeredAppUser, setRegisteredAppUser] = useState(null);

    const postNewUser = async (username, email) => {
        const response = await fetch(`http://localhost:4000/appusers`, {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                username: username,
                email: email
            })
        });
        const bodyText = await response.json();
        if (response.status === 201) {
            setRegisteredAppUser(bodyText.appUser[0]);
            setIsSuccessfulRegistration(true);
        }
    }

    return (
        <div>
            {isSuccessfulRegistration ? <SuccessfulSignUp registeredAppUser={registeredAppUser} setRegisteredAppUser={setRegisteredAppUser} /> : <SignUpForm postNewUser={postNewUser} />}
        </div>
    );
}

