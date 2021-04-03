import React, { useState, useEffect } from "react";

export const LoginForm = ({ checkUserCredentials }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [usernameValidationMessage, setUsernameValidationMessage] = useState('');

    // Validate username - only want alphanumeric and no spaces, just to make things simple
    useEffect(() => {
        const regex = new RegExp("^[a-zA-Z0-9_]*$");
        !regex.test(username) ? setUsernameValidationMessage('*Usernames only contain alphanumeric characters') : setUsernameValidationMessage('');
    }, [username]);

    const handleSubmit = event => {
        event.preventDefault();
        if (username.length === 0 || email.length === 0) {
            return;
        }
        checkUserCredentials(username, email);
        setUsername('');
        setEmail('');
    }

    return (
        <div className="user-credentials sign-in">
            <h3>Log in</h3>
            <form className="user-credentials-form" onSubmit={handleSubmit}>
                <div className="input-label-container">
                    <label for="username-input" >Username</label>
                    <input type="text" id="username-input" name="username" onChange={event => setUsername(event.target.value)} value={username}/>
                    <p className="validation-message">{usernameValidationMessage}</p>
                </div>

                <div className="input-label-container">
                    <label for="email-input">Email</label>
                    <input type="email" id="email-input" name="email" onChange={event => setEmail(event.target.value)} value={email} />
                </div>

                <div>
                    <input type="submit" value='Log in' />
                </div>
                
                <hr></hr><p className="button-separator">or</p><hr></hr>
                
                <div>
                    <input type="button" value='Try as guest' />
                </div>

            </form>
        </div>
    );
}
