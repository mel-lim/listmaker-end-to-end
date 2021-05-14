import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export const Nav = () => {
    const { user } = useContext(UserContext);

    return (
        <nav id="sticky-nav">
            <ul>

                <Link to="/dashboard">
                    <li>dashboard</li>
                </Link>

                <li className="middot" >&middot;</li>

                {
                    !user ?
                        <div>
                            <Link to="/tryasguest">
                                <li>try as guest</li>
                            </Link>
                        </div>
                        :
                        null
                }

                <li className="middot" >&middot;</li>

                {
                    !user ?
                        <div>
                            <Link to="/signup">
                                <li>sign up</li>
                            </Link>
                        </div>
                        :
                        <div>
                            <Link to="/myaccount">
                                <li>my account</li>
                            </Link>
                        </div>
                }

                <li className="middot" id="one-line-middot">&middot;</li>

                {
                    !user ?
                        <div>
                            <Link to="/login">
                                <li>log in</li>
                            </Link>
                        </div> :
                        <div>
                            <Link to="/logout">
                                <li>log out</li>
                            </Link>
                        </div>
                }

                <li className="middot">&middot;</li>
                <Link to="/contact">
                    <li>contact</li>
                </Link>

            </ul>
        </nav>
    );
}