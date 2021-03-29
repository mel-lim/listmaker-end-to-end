import React, { useState, useEffect } from "react";

export const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
    const [isSuccessfulRegistration, setIsSuccessfulRegistration] = useState(false);

    useEffect(() => {
        const regex = new RegExp("^[a-zA-Z0-9_]*$");
        !regex.test(username) ? setUsernameValidationMessage('*Use only alphanumeric characters') : setUsernameValidationMessage('');
    }, [username]);

    const postNewUser = async () => {
        const response = await fetch(`http://localhost:4000/appusers`, {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                username: username,
                email: email
            })
        });
        return response.json();
    }

    const handleSubmit = event => {
        event.preventDefault();
        // Prevent submission if either username or email fields are empty
        if (username.length === 0 || email.length === 0) {
            return;
        }
        postNewUser();
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

                <p className="button-separator"><hr></hr> or <hr></hr></p>

                <div>
                    <input type="button" value='Try as guest' />
                </div>
            </form>
        </div>
    );
}

