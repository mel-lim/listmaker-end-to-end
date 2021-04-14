import React, { useState, useContext } from "react";
import { UserContext, CookieExpiryContext } from "../UserContext";
import { LoginForm } from "../components/Login/LoginForm";

import configData from "../config.json";

export const LogIn = () => {

    const usernameRegex = new RegExp(configData.USERNAME_REGEX);
    const emailRegex = new RegExp(configData.EMAIL_REGEX);

    const { setUser } = useContext(UserContext);
    const { setCookieExpiry } = useContext(CookieExpiryContext);

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

        if (response.status === 200) {
            setUser(responseBodyText.username);
            setCookieExpiry(responseBodyText.cookieExpiry);
            console.log("login sucessful");

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
