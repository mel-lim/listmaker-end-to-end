import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {

    return (
        <div className="home">

            <h2>Welcome to Collaberie</h2>

            <h5>For now, our web app delivers a backcountry listmaker tool that lets you:</h5>
            <ul>
                <li>Generate customised lists of suggested items to bring on your trip based on type of activity and duration of trip</li>
                <li>Personalise your lists by adding, editing and deleting</li>
                <li>Save your lists organised by trip</li>
            </ul>

            <h5>We have bold plans to build Collaberie into a collaborative dashboard with a full suite of helpful expedition planning tools that you can use with your team mates. Check back periodically to see our latest developments!</h5>

            <Link to="/signup">
                            
                                <input type="button" value='Sign up' />
                            
                        </Link>
                        <Link to="/login">
                            
                                <input type="button" value='Log in' />
                            
                        </Link>

        </div>

    )

}