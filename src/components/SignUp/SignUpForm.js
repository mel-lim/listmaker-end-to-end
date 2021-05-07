import React, { useState, useEffect } from "react";
/* import { UserContext } from '../../UserContext'; */
import { signUpNewUserApi } from "../../api";
import configData from "../../config.json";

export const SignUpForm = ({ setRegisteredAppUser, setIsSuccessfulRegistration }) => {
    /* const { setUser } = useContext(UserContext); */

    // States for the form itself
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [submissionUnsuccessfulMessage, setSubmissionUnsuccessfulMessage] = useState('');

    const [signingInMessage, setSigningInMessage] = useState(null);
    const [serverStatusMessage, setServerStatusMessage] = useState(null);

    // Live validation username - only want alphanumeric and no spaces, just to make things simple
    useEffect(() => {
        const regex = new RegExp(configData.ALPHANUMERIC_UNDERSCORE_REGEX);
        !regex.test(username) ? setUsernameValidationMessage('*Use only alphanumeric characters and underscores') : setUsernameValidationMessage('');
    }, [username]);

    // Live validation that the password and confirm password fields match
    useEffect(() => {
        if (password.length === 0 && confirmPassword.length === 0) {
            return;
        }
        password === confirmPassword ? setPasswordMatchMessage('Passwords match') : setPasswordMatchMessage('Passwords do not match');
    }, [password, confirmPassword]);

    let serverDownSignInAttempts = 0;
    const signUpNewUser = async (username, email, password) => {
        setSigningInMessage("Signing you in...");

        // Construct body of request to send to server containing the new user details
        const requestBodyContent = { username, email, password };

        try {
            // Api call to sign up new user
            const { response, responseBodyText } = await signUpNewUserApi(requestBodyContent);

            if (response.ok === true) {
                setRegisteredAppUser(responseBodyText.appUser);
                setIsSuccessfulRegistration(true);

            } else { // i.e. response.ok === false
                setIsSuccessfulRegistration(false);
                setSigningInMessage(null);
                setSubmissionUnsuccessfulMessage("** " + responseBodyText.message + " **");
                setUsername(username);
                setEmail(email);
                setPassword(password);
            }
        }
        catch (error) {
            console.error("The server is down");
            setSigningInMessage(null);
            setUsername(username);
            setEmail(email);
            setPassword(password);
            if (serverDownSignInAttempts < 5) {
                setServerStatusMessage('The server not responding. Trying again...');
                setTimeout(() => {
                    signUpNewUser(username, email, password);
                }, 4000);
            } else {
                setServerStatusMessage('We are so sorry. Our server is experiencing some problems. Please come back later.');
            }
            serverDownSignInAttempts++;

        }
    }

    const handleSubmit = event => {
        event.preventDefault();
        const usernameRegex = new RegExp(configData.USERNAME_REGEX);

        // Prevent submission if either username or email fields are empty
        if (username.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            setSubmissionUnsuccessfulMessage('** All fields must be completed **');
            return;

        } else if (!usernameRegex.test(username)) { // Prevent submission if the username contains undesired characters or is too short
            setSubmissionUnsuccessfulMessage('** Username must contain only alphanumeric characters or underscores, and be at least two characters long **');
            return;

        } else if (password !== confirmPassword) { // Prevent submission if the password and confirm password fields don't match
            setSubmissionUnsuccessfulMessage('** Passwords do not match **');
            return;
        }

        // Calls the signUpNewUser function to send new user details to the server
        signUpNewUser(username, email, password);

        /* // Reset all the fields
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPasswordMatchMessage('');
        setSubmissionUnsuccessfulMessage(''); */
    }

    const toggleShowPassword = event => {
        event.preventDefault();
        setShowPassword(!showPassword);
    }
    /* const tryAsGuest = () => {
        setUser('guest');
    } */

    return (
        <div className="user-credentials sign-up">
            <h3>Sign up</h3>

            <p className="submission-unsuccessful-message">{signingInMessage}</p>
            <p className="submission-unsuccessful-message">{submissionUnsuccessfulMessage}</p>
            <p className="submission-unsuccessful-message">{serverStatusMessage}</p>

            <form className="user-credentials-form" onSubmit={handleSubmit}>
                <div className="input-label-container">

                    <label htmlFor="username-input" >Username (minimum 2 characters)</label>

                    <input type="text"
                        id="username-input"
                        name="username"
                        onChange={event => setUsername(event.target.value)}
                        value={username}
                        required />

                    <p className="validation-message">{usernameValidationMessage}</p>
                </div>

                <div className="input-label-container">

                    <label htmlFor="email-input">Email</label>

                    <input type="email"
                        id="email-input"
                        name="email"
                        onChange={event => setEmail(event.target.value)}
                        value={email}
                        required />
                </div>

                <div className="input-label-container">

                    <label htmlFor="password-input">Password (minimum 8 characters)</label>

                    <input type={showPassword ? "text" : "password"}
                        id="password-input"
                        name="password"
                        minLength="8"
                        autoComplete="new-password"
                        onChange={event => setPassword(event.target.value)}
                        value={password}
                        required />

                    <button type="button"
                        className={showPassword ? "visible password-button" : "not-visible password-button"}
                        onClick={toggleShowPassword}></button>
                </div>

                <div className="input-label-container">

                    <label htmlFor="confirm-password-input">Confirm Password</label>

                    <input type="password"
                        id="confirm-password-input"
                        name="password"
                        autoComplete="current-password"
                        onChange={event => {
                            setConfirmPassword(event.target.value)
                        }}
                        value={confirmPassword}
                        required />

                    <p className="validation-message">{passwordMatchMessage}</p>
                </div>

                <div>
                    <input type="submit"
                        className="pillbox-button"
                        value='Sign up' />
                </div>

            </form>

            {/* <hr></hr><p className="button-separator">or</p><hr></hr>
            <div>
                <input type="button"
                    className="pillbox-button"
                    value='Try as guest'
                    onClick={tryAsGuest} />
            </div> */}

        </div>
    );
}

