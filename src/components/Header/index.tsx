import React from 'react';

import './styles.css';

import deadHandIcon from '../../assets/images/dead-hand-icon.svg';

function Header() {
  return (
    <header>
      <img id="logo-icon" alt="app icon" src={ deadHandIcon } />
      <h1>TRZ</h1>
    </header>
  );
}

export default Header;