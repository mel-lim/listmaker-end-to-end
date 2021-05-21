import React, { useState } from "react";
import { SignUpForm } from "../components/SignUp/SignUpForm";
import { SignUpSuccessful } from "../components/SignUp/SignUpSuccessful"; 


export const SignUp = () => {
    const [registeredAppUser, setRegisteredAppUser] = useState(null);
    const [isSuccessfulRegistration, setIsSuccessfulRegistration] = useState(false);

    return (
        <div>
            {
                isSuccessfulRegistration ?
                    <SignUpSuccessful
                        registeredAppUser={registeredAppUser} />
                    : <SignUpForm
                        setRegisteredAppUser={setRegisteredAppUser}
                        setIsSuccessfulRegistration={setIsSuccessfulRegistration} />
            }
        </div>
    );
}

