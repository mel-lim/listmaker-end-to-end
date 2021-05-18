import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { LoadSpinner } from "../components/LoadSpinner/LoadSpinner";

import { UserContext, GuestUserContext, CookieExpiryContext, OpenConfirmCredentialsModalContext } from "../UserContext";
import { delay, logoutApi } from "../api";

// Import config data
import configData from "../config.json";

export const Logout = () => {

  const { setUser } = useContext(UserContext);
  const { setCookieExpiry } = useContext(CookieExpiryContext);
  const { setIsGuestUser } = useContext(GuestUserContext);
  const { setOpenConfirmCredentialsModal } = useContext(OpenConfirmCredentialsModalContext);

  const [progressMessage, setProgressMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ redirectToHome, setRedirectToHome ] = useState(false);

  const logout = async (retryCount = 0) => {
    setIsLoading(true);
    setProgressMessage("Logging you out...");

    try {
      // Call the api to get server to delete the cookies
      // Note, the cookie containing the JWT can only be deleted server-side because it is a http only cookie
      const { response, responseBodyText } = await logoutApi();
      console.log(responseBodyText);


      if (response.ok === true) {
        setTimeout(() => {
          // Reset all the contexts
        setOpenConfirmCredentialsModal(false);
        setIsGuestUser(false);
        setCookieExpiry(null);
        setUser(null);
        }, 5);

        setIsLoading(false);
        
        // Cause the redirect to Home
        setRedirectToHome(true);
      }

      else {
        setIsLoading(false);
        setProgressMessage("** " + responseBodyText.message + " **");
      }

      // Clear the localStorage
      localStorage.clear();
      
    } catch (error) {
      console.error("Error in logout function. Cannot connect to server");

      if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
        setProgressMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
        await delay(retryCount); // Exponential backoff - see api.js
        return logout(retryCount + 1); // After the delay, try connecting again
      }

      setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
      setIsLoading(false);
    }
  }

  const handleClick = event => {
    event.preventDefault();
    logout();
  }

  return (
    redirectToHome ?
      <Redirect to="/" />
      :
      <div className="user-credentials logout">
        <h3>Confirm log out</h3>
        <input type="button"
          className="pillbox-button"
          value="Log Out"
          onClick={handleClick} />
        <p>{progressMessage}</p>
        {
          isLoading ?
            <LoadSpinner />
            : null
        }
      </div>
  );
}

