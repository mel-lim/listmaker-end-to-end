import React, { useState, useEffect } from "react";

export const SuccessfulSignUp = ({ registeredUsername, registeredEmail }) => {

    const handleSubmit = event => {
        event.preventDefault();
        
    }

    return (
        <div className="user-credentials sign-up">
            <h3>You've successfully registered your details</h3>
            <p>Username: {registeredUsername}</p>
            <p>Email: {registeredEmail}</p>
            <input type="button" value="Log in" />
        </div>
    );
}

