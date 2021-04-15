import React, { useState, useMemo, useEffect } from "react";
import './App.css';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Cookies from "js-cookie";

import { UserContext, CookieExpiryContext } from "./UserContext";

import { Home } from "./containers/Home";
import { Nav } from "./containers/Nav";
import { Contact } from "./containers/Contact";

import { SignUp } from "./containers/SignUp";
import { Login } from "./containers/Login";

import { Dashboard } from "./containers/Dashboard";
import { MyAccount } from "./containers/MyAccount";
import { LogOut } from "./containers/LogOut";

import { ProtectedLoggedIn } from "./routes/ProtectedLoggedIn";
import { ProtectedLoggedOut } from "./routes/ProtectedLoggedOut";

function App() {
  const [user, setUser] = useState(null);
  const [cookieExpiry, setCookieExpiry] = useState(null);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const cookieExpiryValue = useMemo(() => ({ cookieExpiry, setCookieExpiry }), [cookieExpiry, setCookieExpiry]);

  // Check if the user is logged in, and if so, set that to state
  useEffect(() => {
    const username = Cookies.get("username");
    console.log(username);
    if (username) {
      setUser(username);
      localStorage.setItem("lastUser", JSON.stringify(username)); // Keep track of the last user - if the user didn't get logged out at the end of the session, this should still be there - we will want to check this against a newly logged in user and delete the localStorage if it is a different user
    }
  }, [user]);

  return (
    <Router>


      <header className="website-name">
        <Link to="/">
          <h1>Collaberie</h1>
        </Link>
      </header>




      <UserContext.Provider value={userValue}>
        <CookieExpiryContext.Provider value={cookieExpiryValue}>


          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <ProtectedLoggedIn path="/dashboard" component={Dashboard} />
            <Route path="/signup" component={SignUp} />
            <ProtectedLoggedOut path="/login" component={Login} />
            <Route path="/myaccount" component={MyAccount} />
            <ProtectedLoggedIn path="/logout" component={LogOut} />
            <Route path="/contact" component={Contact} />
          </Switch>
        </CookieExpiryContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
