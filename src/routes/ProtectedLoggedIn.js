import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

import Cookies from "js-cookie";

export const ProtectedLoggedIn = ({ component: Component, ...rest }) => {

  // The reason we are doing this, rather than checking the user context, is that when we everytime we refresh the window, the user context is reset briefly until the useEffect hook in App.js reads the cookie and resets the user to the username cookie.

  // In this moment, this protected route determins user = false and redirects to the login page, then the setUser kicks in, and redirects from login page to dashboard. The result is that we keep going back to the dashboard on refresh. This also meant I couldn't open myaccount or logout in a new tab without it going back to dashboard. 

  // Now it works. YES.

  const [ isLoggedIn, setIsLoggedIn ] = useState(true);

  // Check if the user is logged in
  useEffect(() => {
    const username = Cookies.get("username"); 
    setIsLoggedIn(!!username);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Route {...rest}
      render={
        () => isLoggedIn ?
          (
            <Component />
          ) :
          (
            <Redirect to="/login" />
          )
      } />
  )
}