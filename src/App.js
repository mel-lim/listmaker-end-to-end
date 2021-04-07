import React, { useState, useMemo } from "react";
import './App.css';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Nav } from "./containers/Nav";
import { Dashboard } from "./containers/Dashboard";
import { SignUp } from "./containers/SignUp";
import { LogIn } from "./containers/LogIn";
import { LogOut } from "./containers/LogOut";
import { Contact } from "./containers/Contact";

import { UserContext } from "./UserContext";
import { ProtectedDashboard } from "./routes/ProtectedDashboard";
import { ProtectedLogin } from "./routes/ProtectedLogin";
import { ProtectedLogout } from "./routes/ProtectedLogout";

function App() {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>

      <header>
        <h1>Backcountry Listmaker</h1>
      </header>

      <UserContext.Provider value={value}>
        <Nav />
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <ProtectedDashboard path="/dashboard" component={Dashboard} />
          <Route path="/signup" component={SignUp} />
          <ProtectedLogin path="/login" component={LogIn} />
          <ProtectedLogout path="/logout" component={LogOut} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </UserContext.Provider>

    </Router>
  );
}

export default App;
