import React, { useState } from "react";
import { SignUpForm } from "../components/SignUp/SignUpForm";
import { SignUpSuccessful } from "../components/SignUp/SignUpSuccessful";import { postNewUserApi } from "../api";

export const SignUp = () => {
    const [registeredAppUser, setRegisteredAppUser] = useState(null);
    const [attemptedAppUser, setAttemptedAppUser] = useState(null);
    const [isSuccessfulRegistration, setIsSuccessfulRegistration] = useState(false);
    const [isFailedRegistration, setIsFailedRegistration] = useState(false);
    
    const postNewUser = async (username, email, password) => {
        const requestBodyContent = {
            username: username,
            email: email,
            password: password
        };
        
        const { response, responseBodyText } = await postNewUserApi(requestBodyContent);

        if (response.status === 201) {
            setRegisteredAppUser(responseBodyText.appUser);
            console.log(responseBodyText.appUser);
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

