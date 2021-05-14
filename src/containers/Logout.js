import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext, GuestUserContext } from "../UserContext";
import { delay, logoutApi } from "../api";

// Import config data
import configData from "../config.json";

export const Logout = () => {

  const { setUser } = useContext(UserContext);
  const { setIsGuestUser } = useContext(GuestUserContext);

  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const logout = async (retryCount = 0) => {
    try {
      // Call the api to get server to delete the cookies
      // Note, the cookie containing the JWT can only be deleted server-side because it is a http only cookie
      const { response, responseBodyText } = await logoutApi();
      console.log(responseBodyText);
      setErrorMessage(null);

      if (response.ok === true) {
        setIsLoggedOut(true);
        setUser(null);
        setIsGuestUser(false);
      } 
      else {
        setErrorMessage("Something went wrong while logging you out. Please try again.")
      }

      // Clear the localStorage
      localStorage.clear();

    } catch(error) {
      console.error("Error in logout function. Cannot connect to server");

      if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
        setErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
        await delay(retryCount); // Exponential backoff - see api.js
        return logout(retryCount + 1); // After the delay, try connecting again
    }
    
    setErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
    }
  }

  const handleClick = event => {
    event.preventDefault();
    logout();
  }

  return (
    isLoggedOut ?
      <Redirect to="/" />
      :
      <div className="user-credentials logout">
        <h3>Confirm log out</h3>
        <input type="button"
          className="pillbox-button"
          value="Log Out"
          onClick={handleClick} />
          <p>{errorMessage}</p>
      </div>

  );
}

