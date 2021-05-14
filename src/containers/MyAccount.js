import React, { useState, useEffect } from "react";
import { delay, getAccountDetailsApi } from "../api";

// Import config data
import configData from "../config.json";

export const MyAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        getAccountDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAccountDetails = async (retryCount = 0) => {
        try {
            const { response, responseBodyText } = await getAccountDetailsApi();
            setErrorMessage(null);

            if (response.ok === true) {
                setUsername(responseBodyText.username);
                setEmail(responseBodyText.email);
            }
            else {
                setErrorMessage("Something went wrong while fetching your account details. Please try again.")
              }
        } 
        
        catch(error) {
            console.error("Error in getAccountDetails function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
                await delay(retryCount); // Exponential backoff - see api.js
                return getAccountDetails(retryCount + 1); // After the delay, try connecting again
            }
            
            setErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
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
            <p>{errorMessage}</p>
        </div>
    );
}