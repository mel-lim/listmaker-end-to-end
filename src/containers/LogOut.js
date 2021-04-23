import React, { useContext } from "react";
import { UserContext } from "../UserContext";


export const LogOut = () => {

  const { setUser } = useContext(UserContext);

  const logOut = async () => {
    // Delete the cookies
    // Note, the cookie containing the JWT can only be deleted server-side because it is a http only cookie
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

    // Clear the localStorage
    localStorage.clear();
  }

  const handleClick = event => {
    event.preventDefault();
    logOut();
  }

  return (
    <div className="user-credentials logout">
      <h3>Confirm log out</h3>
      <input type="button"
        className="pillbox-button"
        value="Log Out"
        onClick={handleClick} />
    </div>
  );
}

