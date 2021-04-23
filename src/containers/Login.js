import React from "react";
import { ValidateCredentials } from "../components/Login/ValidateCredentials";

export const Login = () => {
    const context = "login";

    return (
        <div>
            <ValidateCredentials context={context} />
        </div>
    );
}
