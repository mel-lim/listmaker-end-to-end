import React, { useState, useContext, useMemo } from "react";
import './App.css';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Nav } from "./containers/Nav";
import { Home } from "./containers/Home";
import { SignUp } from "./containers/SignUp";
import { LogIn } from "./containers/LogIn";
import { Contact } from "./containers/Contact";
import { UserContext } from "./UserContext";

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
          <Route path="/" exact component={Home} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={LogIn} />
          <Route path="/logout" component={LogIn} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </UserContext.Provider>

    </Router>
  );
}

export default App;
