import React, { useState, useEffect } from "react";
import { SignUpForm } from "../components/SignUpForm";
import { SuccessfulSignUp } from "../components/SuccessfulSignUp";

export const SignUp = () => {

    const [isSuccessfulRegistration, setIsSuccessfulRegistration] = useState(false);
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');

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
        if (response.status === 201) {
            setIsSuccessfulRegistration(true);
            setRegisteredUsername(username);
            setRegisteredEmail(email);
        }
    }

    return (
        <div>
            {isSuccessfulRegistration ? <SuccessfulSignUp registeredUsername={registeredUsername} registeredEmail={registeredEmail} /> : <SignUpForm postNewUser={postNewUser} />}
        </div>
    );
}

