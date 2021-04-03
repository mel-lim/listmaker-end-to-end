import React, { useState } from "react";
import { LoginForm } from "../components/Login/LoginForm";
import { LoginSuccessful } from "../components/Login/LoginSuccessful";

export const LogIn = () => {

    const checkUserCredentials = async (username, email) => {
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
        if (response.status === 200) {
            console.log(bodyText.appUser[0]);
        }

    }

    return (
        <LoginForm checkUserCredentials={checkUserCredentials} />
    );
}
