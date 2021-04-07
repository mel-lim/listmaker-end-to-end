import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../UserContext";

export const ProtectedLogin = ({ component: Component, ...rest }) => {

  const { user } = useContext(UserContext);

  return (
    <Route {...rest} render={() => !user ? (
      <Component />
    ) :
      (
        <Redirect to="/dashboard" />
      )
    } />
  )
}