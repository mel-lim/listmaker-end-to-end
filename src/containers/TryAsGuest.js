import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext, CookieExpiryContext, GuestUserContext } from '../UserContext';
import { delay, tryAsGuestApi } from "../api";

export const TryAsGuest = () => {
    const { setUser } = useContext(UserContext);
    const { setCookieExpiry } = useContext(CookieExpiryContext);
    const { setIsGuestUser } = useContext(GuestUserContext);

    const [progressMessage, setProgressMessage] = useState(null);

    const tryAsGuest = async (retryCount = 0) => {
        setProgressMessage("Creating guest account...");
        setIsGuestUser(true);

        try {
            // Api call to sign up new user
            const { response, responseBodyText } = await tryAsGuestApi();

            if (response.ok === true) {
                setUser(responseBodyText.username);
                setCookieExpiry(responseBodyText.guestCookieExpiry);

            } else { // i.e. response.ok === false
                setProgressMessage("** Something went wrong, please try again **");
            }
        } catch (error) {
            console.error("Error in tryAsGuest function", error);

            if (retryCount < 5) {
                setProgressMessage(`The server not responding. Trying again... ${retryCount}/4`);
                await delay(retryCount); // Exponential backoff - see api.js
                return tryAsGuest(retryCount + 1); // After the delay, try connecting again

            } else {
                setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            }
        }
    }

    const handleClick = () => {
        tryAsGuest();
    }

    return (
        <div className="user-credentials try-as-guest">
            <h3>Try kit collab as a guest user</h3>
            <p>Don't want to commit to signing up?  No problems.</p>
            <p>You can try kit collab as a guest user.  You'll get 12 hours of full access. It's the perfect way to try all the features our app has to offer.</p>
            <p>Please be warned, once you log out as a guest user, you will not be able to log back in again.</p>
            <p>You can start a new guest user account, but you will not have access to the data you saved in your previous guest user account.</p>
            <p>After 12 hours, any data you saved as a guest user will be deleted.</p>
            <p>If you don't want this to happen, please sign up with a real account so we can store your trips and lists for you. It's totally free, you just have to register.</p>

            <input type="button"
                className="pillbox-button"
                value="Try as guest"
                onClick={handleClick} />

            <Link to="/signup">
                    <input type="button"
                        className="pillbox-button"
                        value='Sign up' />
            </Link>

            <p className="submission-unsuccessful-message progress-message">{progressMessage}</p>
        </div>
    )
}

