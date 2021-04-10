import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export const Nav = () => {
    const {user} = useContext(UserContext);

    return (
        <nav id="sticky-nav">
            <ul>

                <Link to="/dashboard">
                    <li>Dashboard</li>
                </Link>

                <li>&middot;</li>

                {!user ?
                    <div>
                        <Link to="/signup">
                            <li>Sign up</li>
                        </Link>
                    </div>
                    :
                    <div>
                        <Link to="/myaccount">
                            <li>My account</li>
                        </Link>
                    </div>
                }

                <li id="one-line-middot">&middot;</li>

                {/*div id="nav-item-pair">*/}

                    {!user ?
                        <div>
                            <Link to="/login">
                                <li>Log in</li>
                            </Link>
                        </div> :
                        <div>
                            <Link to="/logout">
                                <li>Log out</li>
                            </Link>
                        </div>
                    
                }

                    <li>&middot;</li>
                    <Link to="/contact">
                        <li>Contact</li>
                    </Link>

            </ul>
        </nav>
    );
}