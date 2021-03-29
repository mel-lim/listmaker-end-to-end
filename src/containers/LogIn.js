import React, { useState } from "react";

export const LogIn = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        if (username.length === 0 || email.length === 0) {
            return;
        }
        //addListItem(userInput);
        setUsername('');
    }

    return (
        <div className="user-credentials sign-in">
            <h3>Log in</h3>
            <form className="user-credentials-form" onSubmit={handleSubmit}>
                <div className="input-label-container">
                    <label for="username-input" >Username</label>
                    <input type="text" id="username-input" name="username" onChange={event => setUsername(event.target.value)} />
                </div>

                <div className="input-label-container">
                    <label for="email-input">Email</label>
                    <input type="email" />
                </div>

                <div>
                    <input type="submit" value='Log in' />
                </div>
                
                    <p><hr></hr> or <hr></hr></p>
                
                <div>
                    <input type="button" value='Try as guest' />
                </div>

            </form>
        </div>
    );
}
