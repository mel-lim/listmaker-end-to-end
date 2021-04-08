import React, { useState } from "react";

export const MyAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const getAccountDetails = async () => {

        const response = await fetch('/appusers/accountdetails', {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        const responseBodyText = await response.json();
        console.log(responseBodyText);

        if (response.status === 200) {
            setUsername(responseBodyText.username);
            setEmail(responseBodyText.email);
        }
    }

    const handleClick = event => {
        event.preventDefault();
        getAccountDetails();
    }
    return (
        <div className="my-account">
            {
                !username ?
                    (<input type="button" value="Get my details" onClick={handleClick} />) :
                    (<div>
                        <h3>Account Details</h3>
                        <p>Username: {username}</p>
                        <p>Email: {email}</p>
                    </div>)
            }
        </div>
    );
}