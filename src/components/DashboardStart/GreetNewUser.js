import React, { useContext } from "react";
import { UserContext } from "../../UserContext";

export const GreetNewUser = () => {

    const { user } = useContext(UserContext);
    
    return (
        <article className="dashboard-greeting">
            <h3>Hi {user}!</h3>
            <h5 className="lighter-weight">Every successful adventure starts with a few good lists.</h5> 
        </article>
        
    );
}