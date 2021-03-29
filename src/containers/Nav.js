import React from "react";
import { Link } from "react-router-dom";

export const Nav = () => {
    return (
        <nav id="sticky-nav">
            <ul>

                <Link to="/">
                    <li>Home</li>
                </Link>

                <li>&middot;</li>
                <Link to="/signup">
                    <li>Sign up</li>
                </Link>

                <li id="one-line-middot">&middot;</li>
                <div id="nav-item-pair">
                    <Link to="/login">
                        <li>Log in</li>
                    </Link>

                    <li>&middot;</li>
                    <Link to="/contact">
                        <li>Contact</li>
                    </Link>
                </div>
            </ul>
        </nav>
    );
}