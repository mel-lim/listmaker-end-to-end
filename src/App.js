import React, { useState, useMemo, useEffect } from "react";
import './App.css';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Cookies from "js-cookie";

import { UserContext, CookieExpiryContext, GuestUserContext } from "./UserContext";

import { Home } from "./containers/Home";
import { Nav } from "./containers/Nav";
import { HamburgerNav } from "./containers/HamburgerNav";
import { Contact } from "./containers/Contact";

import { TryAsGuest } from "./containers/TryAsGuest";
import { SignUp } from "./containers/SignUp";
import { Login } from "./containers/Login";

import { Dashboard } from "./containers/Dashboard";
import { MyAccount } from "./containers/MyAccount";
import { Logout } from "./containers/Logout";

import { ProtectedLoggedIn } from "./routes/ProtectedLoggedIn";
import { ProtectedLoggedOut } from "./routes/ProtectedLoggedOut";

function App() {
  const [user, setUser] = useState(null);
  const [cookieExpiry, setCookieExpiry] = useState(null);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const cookieExpiryValue = useMemo(() => ({ cookieExpiry, setCookieExpiry }), [cookieExpiry, setCookieExpiry]);
  const isGuestUserValue = useMemo(() => ({ isGuestUser, setIsGuestUser }), [isGuestUser, setIsGuestUser]);

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

      <UserContext.Provider value={userValue}>
        <header className="website-name">

          <Link to="/">
            <h1>kit collab.</h1>
          </Link>

          <HamburgerNav />

        </header>

        <CookieExpiryContext.Provider value={cookieExpiryValue}>
          <GuestUserContext.Provider value={isGuestUserValue}>
            <Nav />
            <Switch>
              <Route path="/" exact component={Home} />
              <ProtectedLoggedIn path="/dashboard" component={Dashboard} />
              <ProtectedLoggedOut path="/tryasguest" component={TryAsGuest} />
              <ProtectedLoggedOut path="/signup" component={SignUp} />
              <ProtectedLoggedOut path="/login" component={Login} />
              <Route path="/myaccount" component={MyAccount} />
              <ProtectedLoggedIn path="/logout" component={Logout} />
              <Route path="/contact" component={Contact} />
            </Switch>
          </GuestUserContext.Provider>
        </CookieExpiryContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
