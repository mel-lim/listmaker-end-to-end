import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export const HamburgerNav = () => {
    const { user } = useContext(UserContext);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div id="hamburger-nav">
            <button id="hamburger-navigation-button"
                className="ui-button"
                onClick={event => setShowMenu(!showMenu)}>
            </button>

            <span className="clear"></span>

            {
                showMenu ?
                    <nav id="hamburger-navigation-panel">
                        <ul>
                            {
                                !user ?
                                    <div>
                                        <Link to="/tryasguest">
                                            <li>try as guest</li>
                                        </Link>
                                    </div>
                                    :
                                    <Link to="/dashboard">
                                        <li onClick={event => setShowMenu(!showMenu)}>dashboard</li>
                                    </Link>
                            }
                            <hr />
                            {
                                !user ?
                                    <div>
                                        <Link to="/signup">
                                            <li onClick={event => setShowMenu(!showMenu)}>sign up</li>
                                        </Link>
                                    </div>
                                    :
                                    <div>
                                        <Link to="/myaccount">
                                            <li onClick={event => setShowMenu(!showMenu)}>my account</li>
                                        </Link>
                                    </div>
                            }
                            <hr />
                            {
                                !user ?
                                    <div>
                                        <Link to="/login">
                                            <li onClick={event => setShowMenu(!showMenu)}>log in</li>
                                        </Link>
                                    </div> :
                                    <div>
                                        <Link to="/logout">
                                            <li onClick={event => setShowMenu(!showMenu)}>log out</li>
                                        </Link>
                                    </div>
                            }
                            <hr />
                            <Link to="/contact">
                                <li onClick={event => setShowMenu(!showMenu)}>contact</li>
                            </Link>
                        </ul>
                    </nav>
                    : null
            }
        </div>
    );
}