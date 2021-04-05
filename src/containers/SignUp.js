import React, { useState } from "react";
import { SignUpForm } from "../components/SignUp/SignUpForm";
import { SignUpSuccessful } from "../components/SignUp/SignUpSuccessful";

export const SignUp = () => {
    const [registeredAppUser, setRegisteredAppUser] = useState(null);
    const [attemptedAppUser, setAttemptedAppUser] = useState(null);
    const [isSuccessfulRegistration, setIsSuccessfulRegistration] = useState(false);
    const [isFailedRegistration, setIsFailedRegistration] = useState(false);
    

    const postNewUser = async (username, email, password) => {
        const response = await fetch(`http://localhost:4000/appusers/signup`, {
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
                email: email,
                password: password
            })
        });
        const responseBodyText = await response.json();
        if (response.status === 201) {
            setRegisteredAppUser(responseBodyText.appUser[0]);
            console.log(responseBodyText.appUser[0]);
            setIsSuccessfulRegistration(true);
            setIsFailedRegistration(false);
            setAttemptedAppUser(null);
        } else if (response.status === 400) {
            setAttemptedAppUser({
                errorMessage: responseBodyText.message,
                username: username,
                email: email,
                password: password
            });
            setIsSuccessfulRegistration(false);
            setIsFailedRegistration(true);
        }
    }

    return (
        <div>
            {isSuccessfulRegistration ? <SignUpSuccessful registeredAppUser={registeredAppUser} /> : <SignUpForm postNewUser={postNewUser} attemptedAppUser={attemptedAppUser} isFailedRegistration={isFailedRegistration} />}
        </div>
    );
}

