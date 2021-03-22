import React from "react";

export const Nav = () => {
    return (
        <nav id="sticky-nav">
            <ul>
                <li>Sign in</li>
                <li>&middot;</li>
                <li>Ski touring</li>
                <li id="one-line-middot">&middot;</li>
                <div id="nav-item-pair">
                    <li>Scrambling/hiking</li>
                    <li>&middot;</li>
                    <li>Contact</li>
                </div>
            </ul>
        </nav>
    );
}