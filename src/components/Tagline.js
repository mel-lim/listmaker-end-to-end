import React, { useContext } from "react";
import { UserContext } from "../UserContext";

export const Tagline = () => {

    const { user } = useContext(UserContext);
    
    return (
        <article id="tagline">
            <h3>Hi {user}, plan your next adventure here.</h3>
            <h3 className="lighter-weight">Every successful adventure starts with a good list (or two).</h3>
        </article>
        
    );
}