import React from 'react';

import './styles.css';

import Header from '../../components/Header';
import { Link, Router } from 'react-router-dom';

function Home() {
  return (
    <div id="home">
      <Header />
      <main className="container">
        
      </main>
      <Link className="new-button" to="/new-survivor">
        Add survivor
      </Link>
    </div>
  );  
}

export default Home;