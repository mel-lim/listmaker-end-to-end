import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { LoginForm } from "../components/Login/LoginForm";


export const LogIn = () => {    

    const usernameRegex = /^[a-zA-Z0-9_]*$/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const { setUser } = useContext(UserContext);

    const [attemptedAppUser, setAttemptedAppUser] = useState(null);
    const [isFailedLogin, setIsFailedLogin] = useState(false);

    const checkUserCredentials = async (userIdentity, password) => {

        // Detect whether the user identity inputted is a username or an email
        const requestBodyContent = {};
        if (usernameRegex.test(userIdentity)) {
            requestBodyContent.username = userIdentity;
            requestBodyContent.email = '';
        } else if (emailRegex.test(userIdentity)) {
            requestBodyContent.username = '';
            requestBodyContent.email = userIdentity;
        }

        // Add the password to the body content
        requestBodyContent.password = password;

        const response = await fetch('/appusers/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBodyContent)
        });

        const responseBodyText = await response.json();
        console.log(responseBodyText.username);

        if (response.status === 200) {
            setUser(responseBodyText.username);
            setIsFailedLogin(false);
            setAttemptedAppUser(null);
        } else if (response.status === 400) {
            setAttemptedAppUser({
                errorMessage: responseBodyText.message,
                userIdentity: userIdentity
            });
            setIsFailedLogin(true);
        }

    }

    return (
        <div>
            {<LoginForm usernameRegex={usernameRegex} emailRegex={emailRegex} checkUserCredentials={checkUserCredentials} attemptedAppUser={attemptedAppUser} isFailedLogin={isFailedLogin} />}
        </div>

    );
}
