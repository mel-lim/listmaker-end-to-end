import React, { useState, useEffect } from "react";
import { getAccountDetailsApi } from "../api";

export const MyAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        getAccountDetails();
    }, []);

    const getAccountDetails = async () => {
        try {
            const { response, responseBodyText } = await getAccountDetailsApi();
            console.log(responseBodyText);

            if (response.status === 200) {
                setUsername(responseBodyText.username);
                setEmail(responseBodyText.email);
            }
        } 
        
        catch {
            console.error("Error in getAccountDetails function. Cannot connect to server");
        }
    }

    return (
        <div className="my-account">
            {
                username ?
                    (<div>
                        <h3>Account Details</h3>
                        <p>Username: {username}</p>
                        <p>Email: {email}</p>
                    </div>)
                    : null
            }
        </div>
    );
}