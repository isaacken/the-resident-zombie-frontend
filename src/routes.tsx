import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import NewSurvivor from './pages/NewSurvivor';
import UpdateLocation from './pages/UpdateLocation';
import FlagInfected from './pages/FlagInfected';
import About from './pages/About';

function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={ Home } />
      <Route path="/new-survivor" component={ NewSurvivor } />
      <Route path="/update-location" component={ UpdateLocation } />
      <Route path="/flag-infected" component={ FlagInfected } />
      <Route path="/about" component={ About } />
    </BrowserRouter>
  );
}

export default Routes;