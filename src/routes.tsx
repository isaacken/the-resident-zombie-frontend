import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import NewSurvivor from './pages/NewSurvivor';
import UpdateLocation from './pages/UpdateLocation';

function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={ Home } />
      <Route path="/new-survivor" component={ NewSurvivor } />
      <Route path="/update-location" component={ UpdateLocation } />
    </BrowserRouter>
  );
}

export default Routes;