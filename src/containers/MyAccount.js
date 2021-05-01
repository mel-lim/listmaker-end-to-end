import React, { useState, useEffect } from "react";

export const MyAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        getAccountDetails();
    })

    const getAccountDetails = async () => {

        const response = await fetch('/api/appusers/accountdetails', {
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