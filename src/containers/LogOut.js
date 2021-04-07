import React, { useContext } from "react";
import {  } from "react-router-dom";
import { UserContext } from "../UserContext";

export const LogOut = () => {

    const { setUser } = useContext(UserContext);

    const deleteCookies = async () => {
        const response = await fetch('/appusers/logout', {
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
            setUser(null);
        }
    }

    const handleClick = (event) => {
        event.preventDefault();
        deleteCookies();        
    }

    return (
        <div className="user-credentials logout">
            <h3>Confirm log out</h3>
            <input type="button" value="Log Out" onClick={handleClick} />
        </div>
    );
}

