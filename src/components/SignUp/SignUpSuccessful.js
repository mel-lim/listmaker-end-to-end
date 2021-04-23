import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";

export const SignUpSuccessful = ({ registeredAppUser }) => {

    const { user } = useContext(UserContext);

    return (
        <div className="user-credentials sign-up">

            {!user ?
                <div>
                    <h3>You've successfully registered your details</h3>
                    <p>Username: {registeredAppUser.username}</p>
                    <p>Email: {registeredAppUser.email}</p>
                    <Link to="/login">
                        <input type="button"
                            className="pillbox-button"
                            value="Log in" />
                    </Link>

                </div> :
                <div>
                    <h3>Welcome {user.username}!</h3>
                    <Link to="/dashboard">
                        <input type="button" value="Start listmaking" />
                    </Link>
                </div>
            }
        </div>
    );
}

