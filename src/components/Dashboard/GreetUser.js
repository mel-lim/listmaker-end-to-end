import React, { useContext } from "react";
import { UserContext } from "../../UserContext";

export const GreetUser = () => {

    const { user } = useContext(UserContext);
    
    return (
        <article className="dashboard-greeting">
            <h3>Hi {user}!</h3>
        </article>
        
    );
}