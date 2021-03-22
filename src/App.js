import React, { useState } from "react";
import './App.css';

//import { Switch, Route, Redirect, NavLink } from "react-router-dom";

import { Nav } from "./components/Nav";
import { Tagline } from "./components/Tagline";
import { Questions } from "./components/Questions";
import { Lists } from "./containers/Lists";
import { Footer } from "./containers/Footer";

function App() {
  const [selected, setSelected] = useState('');

  return (
    <div>
      <header>
        <h1>Backcountry Listmaker</h1>
      </header>

      <Nav />

      <main>
        <div id="tagline-and-questions-container">
          <Tagline />
          <Questions setSelected={setSelected} />
        </div>

        <Lists selected={selected} />

      </main>

      <Footer />
    </div>
  );
}

export default App;
