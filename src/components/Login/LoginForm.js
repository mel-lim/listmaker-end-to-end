import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const LoginForm = ({ usernameRegex, emailRegex, checkUserCredentials, attemptedAppUser, isFailedLogin }) => {
    
    const [userIdentity, setUserIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [submissionUnsuccessfulMessage, setSubmissionUnsuccessfulMessage] = useState('');

    // If the user submits a login attempt that fails, it will repopulate the form with previously typed inputs
    useEffect(() => {
        if (isFailedLogin && attemptedAppUser) {
            setSubmissionUnsuccessfulMessage("** " + attemptedAppUser.errorMessage + " **");
            setUserIdentity(attemptedAppUser.userIdentity);
        }
    }, [isFailedLogin, attemptedAppUser]);

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

    return (
        <div className="user-credentials login">

            <h3>Log in</h3>

            <p className="submission-unsuccessful-message">{submissionUnsuccessfulMessage}</p>

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

                <Link to="/signup">
                    <div>
                        <input type="button" value='Sign up' />
                    </div>
                </Link>

            </form>
        </div>
    );
}
