import React, { useState, useEffect, useContext } from "react";
import { LoadSpinner } from "../components/LoadSpinner/LoadSpinner";
import { ConfirmCredentialsModal } from "../components/Login/ConfirmCredentialsModal";

import { GuestUserContext, CookieExpiryContext } from "../UserContext";
import { delay, getAccountDetailsApi, submitPasswordChangeApi } from "../api";
import DayJS from 'react-dayjs';

// Import config data
import configData from "../config.json";

export const MyAccount = () => {
    const { isGuestUser } = useContext(GuestUserContext);
    const { cookieExpiry } = useContext(CookieExpiryContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [progressMessage, setProgressMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [changePassword, setChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState(null);

    const [submissionUnsuccessfulMessage, setSubmissionUnsuccessfulMessage] = useState(null);

    useEffect(() => {
        getAccountDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Live validation that the password and confirm password fields match
    useEffect(() => {
        if (newPassword.length === 0 && confirmNewPassword.length === 0) {
            return;
        }
        newPassword === confirmNewPassword ? setPasswordMatchMessage('Passwords match') : setPasswordMatchMessage('Passwords do not match');
    }, [newPassword, confirmNewPassword]);


    const getAccountDetails = async (retryCount = 0) => {
        setIsLoading(true);

        try {
            const { response, responseBodyText } = await getAccountDetailsApi();
            setProgressMessage("");

            if (response.ok === true) {
                setUsername(responseBodyText.username);
                setEmail(responseBodyText.email);
            }
            else {
                setProgressMessage("Something went wrong while fetching your account details. Please try again.")
            }

            setIsLoading(false);
        }

        catch (error) {
            console.error("Error in getAccountDetails function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return getAccountDetails(retryCount + 1); // After the delay, try connecting again
            }

            setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            setIsLoading(false);
        }
    }

    const submitPasswordChange = async (retryCount = 0) => {
        setIsLoading(true);
        setProgressMessage("Submitting password change...");

        // Construct body of request to send to server
        const requestBodyContent = { oldPassword, newPassword };

        try {
            // Api call to sign up new user
            const { response, responseBodyText } = await submitPasswordChangeApi(requestBodyContent);

            if (response.ok === true) {
                // Close the change password module
                setChangePassword(false);

                // Reset all the fields
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }

            // Show message to user
            setProgressMessage(responseBodyText.message);
            setIsLoading(false);
        }

        catch (error) {
            console.error("Error in submitPasswordChange function. Cannot connect to server.");
            setOldPassword(oldPassword);
            setNewPassword(newPassword);
            setConfirmNewPassword(confirmNewPassword);

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return submitPasswordChange(retryCount + 1); // After the delay, try connecting again

            } else {
                setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
                setIsLoading(false);
            }
        }
    }

    const handleSubmit = event => {
        event.preventDefault();

        // Prevent submission if any of the fields are empty
        if (oldPassword.length === 0 || newPassword.length === 0 || confirmNewPassword.length === 0) {
            setSubmissionUnsuccessfulMessage('** All fields must be completed **');
            return;

        } else if (newPassword !== confirmNewPassword) { // Prevent submission if the password and confirm password fields don't match
            setSubmissionUnsuccessfulMessage('** New password and confirm new password do not match **');
            return;

        } else if (newPassword.length < 8) { // Prevent submission of the new password is less than 8 chars long
            setSubmissionUnsuccessfulMessage('** Passwords must be at least 8 characters long **');
            return;

        } else if (newPassword === oldPassword) { // Prevent submission if the new password is the same as the old password
            setSubmissionUnsuccessfulMessage('** The new password has to be different from the old password **');
            return;
        }

        // Calls the signUpNewUser function to send new user details to the server
        submitPasswordChange();
    }

    // SHOW/HIDE FUNCTION
    const toggleShowPassword = event => {
        setShowNewPassword(!showNewPassword);
    }

    return (
        <div className="my-account">

            <div className="account-details">
                <h3>Account Details</h3>
                {
                    !isGuestUser ?
                        <div>
                            <p>Username: {username}</p>
                            <p>Email: {email}</p>
                            <input type="button"
                                className="pillbox-button change-password-button"
                                value='Change password'
                                onClick={() => setChangePassword(!changePassword)} />
                        </div>
                        :
                        <div>
                            <p>Guest username: {username}</p>
                            <p>Guest account expires: <DayJS format="HH:mm on DD-MMMM-YYYY">{cookieExpiry}</DayJS></p>
                            <p>If you would like to sign up with an actual account, please first log out of this guest user account.</p>
                        </div>
                }
            </div>

            {
                !changePassword ?
                    null :
                    <form className="change-password-form" onSubmit={handleSubmit}>

                        <div className="change-password-input-div">

                            <label htmlFor="old-password-input">Old password</label>

                            <input type="password"
                                id="old-password-input"
                                name="old-password"
                                minLength="8"
                                autoComplete="current-password"
                                onChange={event => setOldPassword(event.target.value)}
                                value={oldPassword}
                                required />
                        </div>

                        <div className="change-password-input-div" id="new-password-input-div">

                            <label htmlFor="new-password-input">New password</label>

                            <input type={showNewPassword ? "text" : "password"}
                                id="new-password-input"
                                name="new-password"
                                minLength="8"
                                autoComplete="new-password"
                                onChange={event => setNewPassword(event.target.value)}
                                value={newPassword}
                                required />

                            <button type="button"
                                className={showNewPassword ? "visible new-eye-password-button" : "not-visible new-eye-password-button"}
                                onClick={toggleShowPassword}></button>
                        </div>
                        <div className="change-password-input-div">

                            <label htmlFor="confirm-new-password-input">Confirm new password</label>

                            <input type="password"
                                id="confirm-new-password-input"
                                name="confirm-new-password"
                                autoComplete="new-password"
                                onChange={event => {
                                    setConfirmNewPassword(event.target.value)
                                }}
                                value={confirmNewPassword}
                                required />

                            <p className="validation-message" id="my-acccount-password-match-message">{passwordMatchMessage}</p>
                        </div>

                        <div>
                            <input type="submit"
                                className="pillbox-button change-password-button"
                                value='Submit change' />
                        </div>
                    </form>
            }

            <p>{submissionUnsuccessfulMessage}</p>
            <p>{progressMessage}</p>
            <div className="my-account-spinner-div">
                {
                    isLoading ?
                        <LoadSpinner />
                        : null
                }
            </div>

            <ConfirmCredentialsModal />  

        </div>
    );
}