import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const SignUpForm = ({ postNewUser }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [usernameValidationMessage, setUsernameValidationMessage] = useState('');

    // Validate username - only want alphanumeric and no spaces, just to make things simple
    useEffect(() => {
        const regex = new RegExp("^[a-zA-Z0-9_]*$");
        !regex.test(username) ? setUsernameValidationMessage('*Use only alphanumeric characters') : setUsernameValidationMessage('');
    }, [username]);

    const handleSubmit = event => {
        event.preventDefault();
        // Prevent submission if either username or email fields are empty
        if (username.length === 0 || email.length === 0) {
            return;
        }
        postNewUser(username, email);
        setUsername('');
        setEmail('');
    }

    return (
        <div className="user-credentials sign-up">
            <h3>Sign up</h3>
            <form className="user-credentials-form" onSubmit={handleSubmit}>
                <div className="input-label-container">
                    <label htmlFor="username-input" >Username</label>
                    <input type="text" id="username-input" name="username" onChange={event => setUsername(event.target.value)} value={username} />
                    <p className="validation-message">{usernameValidationMessage}</p>
                </div>

                <div className="input-label-container">
                    <label htmlFor="email-input">Email</label>
                    <input type="email" id="email-input" name="email" onChange={event => setEmail(event.target.value)} value={email} />
                </div>

                <div>
                    <input type="submit" value='Sign up' />
                </div>

                <hr></hr><p className="button-separator">or</p><hr></hr>

                <div>
                    <Link to="/">
                        <input type="button" value='Try as guest' />
                    </Link>
                </div>

            </form>
        </div>
    );
}

