import React, { useState, useEffect } from "react";
import { delay, getAccountDetailsApi } from "../api";

// Import config data
import configData from "../config.json";

export const MyAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

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
        try {
            const { response, responseBodyText } = await getAccountDetailsApi();
            setErrorMessage(null);

            if (response.ok === true) {
                setUsername(responseBodyText.username);
                setEmail(responseBodyText.email);
            }
            else {
                setErrorMessage("Something went wrong while fetching your account details. Please try again.")
            }
        }

        catch (error) {
            console.error("Error in getAccountDetails function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
                await delay(retryCount); // Exponential backoff - see api.js
                return getAccountDetails(retryCount + 1); // After the delay, try connecting again
            }

            setErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
        }
    }

    const handleSubmit = event => {
        event.preventDefault();

        // Prevent submission if any of the fields fields are empty
        if (oldPassword.length === 0 || newPassword.length === 0 || confirmNewPassword.length === 0) {
            setSubmissionUnsuccessfulMessage('** All fields must be completed **');
            return;

        } else if (newPassword !== confirmNewPassword) { // Prevent submission if the password and confirm password fields don't match
            setSubmissionUnsuccessfulMessage('** New passwords do not match **');
            return;
        } else if (newPassword.length < 8) {
            setSubmissionUnsuccessfulMessage('** Passwords must be at least 8 characters long **')
        }
    }

    const toggleShowPassword = event => {
        event.preventDefault();
        setShowNewPassword(!showNewPassword);
    }

    return (
        <div className="my-account">

            <div className="account-details">
                <h3>Account Details</h3>
                <p>Username: {username}</p>
                <p>Email: {email}</p>

                <input type="button"
                className="pillbox-button change-password-button"
                value='Change password'
                onClick={() => setChangePassword(!changePassword)} />
            </div>

            {
                !changePassword ?
                    null :
                    <form className="change-password-form" onSubmit={handleSubmit}>
                        <div className="change-password-input-div">

                            <label htmlFor="old-password-input">Old password</label>

                            <input type="password"
                                id="old-password-input"
                                name="password"
                                minLength="8"
                                autoComplete="current-password"
                                onChange={event => setOldPassword(event.target.value)}
                                value={oldPassword}
                                required />
                        </div>

                        <div className="change-password-input-div">

                            <label htmlFor="new-password-input">New password</label>

                            <input type={showNewPassword ? "text" : "password"}
                                id="new-password-input"
                                name="password"
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
                                name="password"
                                autoComplete="new-password"
                                onChange={event => {
                                    setConfirmNewPassword(event.target.value)
                                }}
                                value={confirmNewPassword}
                                required />

                            <p className="validation-message">{passwordMatchMessage}</p>
                        </div>

                        <div>
                            <input type="submit"
                                className="pillbox-button change-password-button"
                                value='Submit change' />
                        </div>
                    </form>
            }

            <p>{submissionUnsuccessfulMessage}</p>
            <p>{errorMessage}</p>
        </div>
    );
}