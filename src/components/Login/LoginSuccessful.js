import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";

export const LoginSuccessful = () => {

    const { user } = useContext(UserContext);

    return (
        <div className="user-credentials login">
            <h3>Welcome, {user.username}!</h3>
            <Link to="/">
                <input type="button" value="Start listmaking" />
            </Link>
        </div>
    );
}

