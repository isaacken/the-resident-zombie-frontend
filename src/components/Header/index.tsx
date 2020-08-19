import React from 'react';

import './styles.css';

import deadHandIcon from '../../assets/images/dead-hand-icon.svg';
import goBackIcon from '../../assets/images/go-back-icon.svg';
import { Link } from 'react-router-dom';

interface HeaderProps {
  hasLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({hasLogo, children}) => {
  return (
    <header>
      {hasLogo ? <img id="logo-icon" alt="app icon" src={ deadHandIcon } />
               : <Link to="/"><img id="go-back-icon" alt="go back" src= { goBackIcon } /></Link>
      }
      <h1>{children}</h1>
    </header>
  );
}

export default Header;