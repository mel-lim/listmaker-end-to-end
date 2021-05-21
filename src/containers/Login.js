import React from "react";
import { ValidateCredentials } from "../components/Login/ValidateCredentials";

export const Login = () => {
    return (
        <div>
            <ValidateCredentials context="login" />
        </div>
    );
}
