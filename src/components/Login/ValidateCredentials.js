import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext, CookieExpiryContext } from "../../UserContext";

import configData from "../../config.json";

export const ValidateCredentials = ({ context, setOpenModal }) => {

    const { user, setUser } = useContext(UserContext);
    const { setCookieExpiry } = useContext(CookieExpiryContext);

    const [attemptedAppUser, setAttemptedAppUser] = useState(null);
    const [isFailedLogin, setIsFailedLogin] = useState(false);

    const [userIdentity, setUserIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [submissionUnsuccessfulMessage, setSubmissionUnsuccessfulMessage] = useState('');

    const usernameRegex = new RegExp(configData.USERNAME_REGEX);
    const emailRegex = new RegExp(configData.EMAIL_REGEX);

    // If this we are rendering the confirm credentials modal, we only want the current user to be able to confirm their credentials, so we lock the userIdentity to the user in the pre-existing cookie
    useEffect(() => {
        if (context === "confirmCredentials") {
            setUserIdentity(user);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If the user submits a login attempt that fails, it will repopulate the form with previously typed inputs
    useEffect(() => {
        if (isFailedLogin && attemptedAppUser) {
            setSubmissionUnsuccessfulMessage("** " + attemptedAppUser.errorMessage + " **");
            setUserIdentity(attemptedAppUser.userIdentity);
        }
    }, [isFailedLogin, attemptedAppUser]);


    const checkUserCredentials = async (userIdentity, password) => {

        // Detect whether the user identity inputted is a username or an email
        const requestBodyContent = {};

        if (usernameRegex.test(userIdentity)) {
            requestBodyContent.username = userIdentity;
            requestBodyContent.email = '';

        } else if (emailRegex.test(userIdentity)) {
            requestBodyContent.username = '';
            requestBodyContent.email = userIdentity;
        }

        // Add the password to the body content
        requestBodyContent.password = password;

        const response = await fetch('/appusers/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBodyContent)
        });

        const responseBodyText = await response.json();
        const username = responseBodyText.username;

        if (response.status === 200) {
            if (context === "login") {
                const lastUser = localStorage.getItem("lastUser");

                // If the user that just logged in was not the last user, clear the local storage (if there is anything there)
                if (username !== lastUser) {
                    localStorage.clear();
                }
            } else if (context === "confirmCredentials") {

                // Once the user successfully confirms their credentials, close the modal and let the user continue using the dashboard
                setOpenModal(false);
            }
            setUser(username);
            setCookieExpiry(responseBodyText.cookieExpiry);
            console.log("login sucessful");

        } else if (response.status === 400) {
            setAttemptedAppUser({
                errorMessage: responseBodyText.message,
                userIdentity: userIdentity
            });
            setIsFailedLogin(true);
        }
    }

    const handleSubmit = event => {
        event.preventDefault();

        // Prevent submission if either the userIdentity or password field is empty
        if (context === "login" && userIdentity.length === 0) {
            return;
        }

        // Validate user identity as either valid username or valid email
        if (!usernameRegex.test(userIdentity) && !emailRegex.test(userIdentity)) {
            setSubmissionUnsuccessfulMessage('** Invalid username or email **');
            return;
        } else if (password.length < 8) {
            setSubmissionUnsuccessfulMessage('** Password needs to be greater than 8 characters **');
            return;
        }

        checkUserCredentials(userIdentity, password);
        setUserIdentity('');
        setPassword('');
        setSubmissionUnsuccessfulMessage('');
        console.log("submit clicked");
    }

    const toggleShowPassword = event => {
        event.preventDefault();
        setShow(!show);
    }

    return (
        <div className="user-credentials login">

            <h3>{context === "login" ? "Log in" : "Refresh my token"}</h3>

            <p className="submission-unsuccessful-message">{submissionUnsuccessfulMessage}</p>

            <form className="user-credentials-form" onSubmit={handleSubmit}>

                <div className="input-label-container">
                    <label htmlFor="user-identity-input" >Username or email</label>
                    {context === "login" ?
                        <input type="text"
                            id="user-identity-input"
                            name="userIdentity"
                            onChange={event => setUserIdentity(event.target.value)}
                            value={userIdentity} /> :
                        <input type="text"
                            id="user-identity-input"
                            name="userIdentity"
                            value={userIdentity}
                            readOnly />
                    }
                </div>

                <div className="input-label-container">

                    <label htmlFor="password-input">Password</label>

                    <input type={show ? "text" : "password"}
                        id="password-input"
                        name="password"
                        minLength="8"
                        autoComplete="current-password"
                        onChange={event => setPassword(event.target.value)}
                        value={password}
                        required />
                    <button type="button"
                        className={show ? "visible password-button" : "not-visible password-button"}
                        onClick={toggleShowPassword}></button>

                </div>

                <div>
                    <input type="submit"
                        className="pillbox-button"
                        value={context === "login" ? 'Log in' : 'Confirm'} />
                    {
                        context === "confirmCredentials" ?
                            <Link to="/logout">
                                <input type="button"
                                    className="pillbox-button"
                                    value='Logout now' />
                            </Link>
                            : null
                    }
                </div>

            </form>

            {
                context === "login" ?
                    <div>
                        <hr></hr><p className="button-separator">or</p><hr></hr>

                        <Link to="/signup">
                            <div>
                                <input type="button"
                                    className="pillbox-button"
                                    value='Sign up' />
                            </div>
                        </Link>
                    </div>
                    : null
            }
        </div>
    );
}
