import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import NewSurvivor from './pages/NewSurvivor';

function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={ Home } />
      <Route path="/new-survivor" component={ NewSurvivor } />
    </BrowserRouter>
  );
}

export default Routes;