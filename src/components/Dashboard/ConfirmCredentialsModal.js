import React, { useState, useContext } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { UserContext, CookieExpiryContext } from "../../UserContext";

import configData from "../../config.json";

export const ConfirmCredentialsModal = () => {

    const { setUser } = useContext(UserContext);
    const { setCookieExpiry } = useContext(CookieExpiryContext);

    const [userIdentity, setUserIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [submissionUnsuccessfulMessage, setSubmissionUnsuccessfulMessage] = useState('');

    const [attemptedAppUser, setAttemptedAppUser] = useState(null);
    const [isFailedLogin, setIsFailedLogin] = useState(false);

    const usernameRegex = new RegExp(configData.USERNAME_REGEX);
    const emailRegex = new RegExp(configData.EMAIL_REGEX);

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

        if (response.status === 200) {
            setUser(responseBodyText.username);
            setCookieExpiry(responseBodyText.cookieEßxpiry);
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
        if (userIdentity.length === 0 || password.length === 0) {
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
    }

    const toggleShowPassword = event => {
        event.preventDefault();
        setShow(!show);
    }

    return (<Popup
        trigger={<button className="button"> Open Modal </button>}
        modal
        nested
    >
        {close => (
            <div className="modal">
                <button className="close" onClick={close}>
                    &times;
        </button>
                <div className="header"> Your token is about to expire. Please confirm your login details to keep using the app. </div>

                <div className="content">
                    <form className="user-credentials-form" onSubmit={handleSubmit}>

                        <div className="input-label-container">
                            <label htmlFor="user-identity-input" >Username or email</label>
                            <input type="text" id="user-identity-input" name="userIdentity" onChange={event => setUserIdentity(event.target.value)} value={userIdentity} />
                        </div>

                        <div className="input-label-container">
                            <label htmlFor="password-input">Password</label>
                            <input type={show ? "text" : "password"} id="password-input" name="password" minLength="8" autoComplete="current-password" onChange={event => setPassword(event.target.value)} value={password} required />
                            <button type="button" onClick={toggleShowPassword} >{show ? "Hide" : "Show"}</button>
                        </div>

                        <div>
                            <input type="submit" value='Log in' />
                        </div>

                        <hr></hr><p className="button-separator">or</p><hr></hr>

                    </form>
                </div>

                <div className="actions">
                    <Popup
                        trigger={<button className="button"> Trigger </button>}
                        position="top center"
                        nested
                    >
                        <span>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                            magni omnis delectus nemo, maxime molestiae dolorem numquam
                            mollitia, voluptate ea, accusamus excepturi deleniti ratione
                            sapiente! Laudantium, aperiam doloribus. Odit, aut.
            </span>
                    </Popup>
                    <button
                        className="button"
                        onClick={() => {
                            console.log('modal closed ');
                            close();
                        }}
                    >
                        close modal
          </button>
                </div>
            </div>
        )}
    </Popup>
    );
}