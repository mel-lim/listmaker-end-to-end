import React, { useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { GuestUserContext, UserContext } from '../UserContext';

export const Home = () => {

    const { user } = useContext(UserContext);
    const { isGuestUser } = useContext(GuestUserContext);

    const aboutRef = useRef(null);

    const scrollToAbout = () => {
        aboutRef.current.scrollIntoView();
    }

    return (
        <div className="home">

            <div className="banner">
                <h2>Hello {user}. {!user ? "You're here." : (!isGuestUser ? "Welcome back." : "Welcome")}</h2>

                {
                    !user ?
                        <div>
                            <Link to="/signup">
                                <input type="button" className="pillbox-button" value='Sign up' />
                            </Link>
                            <Link to="/login">
                                <input type="button" className="pillbox-button" value='Log in' />
                            </Link>
                        </div>
                        : null
                }

                <div>
                    <input type="button" className="pillbox-button" value='Learn more' onClick={scrollToAbout} />
                </div>
            </div>


            <div className="about" ref={aboutRef}>
                <h2>About kit collab.</h2>
                <p>The mountains are harsh. Being prepared is key to a successful mission in the backcountry.</p>
                <p>Kit collab delivers a backcountry listmaker tool that lets you:</p>
                <ul>
                    <li>Generate customised lists of suggested items</li>
                    <li>Personalise your lists by adding, editing and deleting</li>
                    <li>Save your lists organised by trip</li>
                </ul>

                <p>Looking forward, we have bold plans to build kit collab into a collaborative dashboard with a full suite of helpful expedition planning tools to help you and your team plan your next outing. Check back periodically to see our latest developments.</p>

                { !user ? 
                    <div>
                        <p>To use kit collab, please sign up with an account or try as a guest user.</p>

                        <div className="about-button-container">
                            <Link to="/signup">
                                <input type="button"
                                    className="pillbox-button about-button"
                                    value='Sign up' />
                            </Link>
                            <Link to="/tryasguest">
                                <input type="button"
                                    className="pillbox-button about-button"
                                    value="Try as guest" />
                            </Link>
                        </div>
                    </div>
                    : null
                }
            </div>

            <footer>
                <p>&#169; mellim.io</p>
            </footer>
        </div>
    )
}