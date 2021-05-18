import React, { useState, useMemo, useEffect, useRef } from "react";
import './App.css';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ScrollToTop from 'react-router-scroll-top'

import Cookies from "js-cookie";
import dayjs from "dayjs";

import { UserContext, CookieExpiryContext, GuestUserContext, OpenConfirmCredentialsModalContext } from "./UserContext";

// Import config data
import configData from "./config.json";

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
  const [openConfirmCredentialsModal, setOpenConfirmCredentialsModal] = useState(false);

  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const cookieExpiryValue = useMemo(() => ({ cookieExpiry, setCookieExpiry }), [cookieExpiry, setCookieExpiry]);
  const isGuestUserValue = useMemo(() => ({ isGuestUser, setIsGuestUser }), [isGuestUser, setIsGuestUser]);
  const openConfirmCredentialsModalValue = useMemo(() => ({ openConfirmCredentialsModal, setOpenConfirmCredentialsModal }), [openConfirmCredentialsModal, setOpenConfirmCredentialsModal])

  const confirmCredentialsTimer = useRef(null);
  const autoLogoutTimer = useRef(null);

  // Check if the user is logged in, and if so, set that to state
  useEffect(() => {
    const username = Cookies.get("username"); // This will persist the user context past refresh
    console.log(username);
    username ? setUser(username) : setUser(null);
  }, []);

  // Keep track of the last user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("lastUser", JSON.stringify(user));
      // If the user wasn't logged out properly at the end of the session, this should still be in localStorage
      // When we next login, we check this against the newly logged in user and delete the localStorage if it is a different user
    }
  }, [user]);

  // PERSIST COOKIE EXPIRY CONTEXT PAST REFRESH
  useEffect(() => {
    const storedCookieExpiry = localStorage.getItem("cookieExpiry");
    if (storedCookieExpiry) {
      setCookieExpiry(JSON.parse(storedCookieExpiry));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the user successfully logs in, cookieExpiry context will be set / changed, and this will be called 
  useEffect(() => {

    if (!cookieExpiry) {
      console.log("no cookieExpiry - return");
      return;
    }

    else {
      console.log("cookieExpiry - timers started");
      localStorage.setItem("cookieExpiry", JSON.stringify(cookieExpiry)); // Save the cookie expiry into localStorage

      // Note to self - we are doing this because it seems impossible to get the cookie expiry from the cookie itself 

      // Set a timer to prompt the user to confirm their credentials and refresh their token before it expires
      const now = dayjs();
      const timeUntilExpiry = dayjs(cookieExpiry).diff(now);

      const confirmCredentialsTime = timeUntilExpiry - parseInt(configData.CONFIRM_CREDENTIAL_INTERVAL); // 5 minutes before the JWT expires

      /* const confirmCredentialsTime = 5000; // TEST */

      // useRef value stored in .current property
      confirmCredentialsTimer.current = setTimeout(() => {
        console.log("confirmCredentialsTimer called");
        setOpenConfirmCredentialsModal(true); // This will open the ConfirmCredentialsModal
      }, confirmCredentialsTime);

      // Set a timer to auto-logout upon the expiry of the token
      const autoLogoutTime = timeUntilExpiry - parseInt(configData.AUTOLOGOUT_BUFFER_INTERVAL);

      /* const autoLogoutTime = 10000; // TEST */

      // useRef value stored in .current property
      autoLogoutTimer.current = setTimeout(() => {
        console.log("autoLogoutTimer called");
        Cookies.remove('username'); // Delete the username cookie
        localStorage.clear(); // Delete localStorage data

        // Reset all the contexts
        setOpenConfirmCredentialsModal(false);
        setIsGuestUser(false);
        setCookieExpiry(null);
        setUser(null);

        // We won't be able to delete the JWT cookie without making an API call because it is HTTP only, but it will delete by itself, when it expires in one minute
      }, autoLogoutTime);

      return (() => { // Clear timer on unmount (dismount?)
        clearTimeout(confirmCredentialsTimer.current);
        clearTimeout(autoLogoutTimer.current);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieExpiry]);

  // PERSIST isGuestUser CONTEXT PAST REFRESH
  useEffect(() => {
    const storedIsGuestUser = localStorage.getItem("isGuestUser");
    if (storedIsGuestUser) {
      setIsGuestUser(JSON.parse(storedIsGuestUser));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the isGuestUser context is updated, store it in localStorage
  useEffect(() => {
    localStorage.setItem("isGuestUser", JSON.stringify(isGuestUser));
  }, [isGuestUser]);

  return (
    // Note to self - I've now realised that I am using React Router v4 syntax - at some stage, we should refactor to v5 syntax, which is simpler
    <Router>
      <ScrollToTop>

        <UserContext.Provider value={userValue}>
          <header className="website-name">

            <Link to="/">
              <h1>kit collab.</h1>
            </Link>

            <HamburgerNav />

          </header>

          <CookieExpiryContext.Provider value={cookieExpiryValue}>
            <GuestUserContext.Provider value={isGuestUserValue}>
              <OpenConfirmCredentialsModalContext.Provider value={openConfirmCredentialsModalValue}>
                <Nav />
                <Switch>
                  <Route path="/" exact component={Home} />
                  <ProtectedLoggedIn path="/dashboard" component={Dashboard} />
                  <ProtectedLoggedOut path="/tryasguest" component={TryAsGuest} />
                  <ProtectedLoggedOut path="/signup" component={SignUp} />
                  <ProtectedLoggedOut path="/login" component={Login} />
                  <ProtectedLoggedIn path="/myaccount" component={MyAccount} />
                  <ProtectedLoggedIn path="/logout" component={Logout} />
                  <Route path="/contact" component={Contact} />
                </Switch>
              </OpenConfirmCredentialsModalContext.Provider>
            </GuestUserContext.Provider>
          </CookieExpiryContext.Provider>
        </UserContext.Provider>
      </ScrollToTop>
    </Router>
  );
}

export default App;
