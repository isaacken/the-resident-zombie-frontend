import React from 'react';

import './styles.css';

import Header from '../../components/Header';
import { Link } from 'react-router-dom';

interface HomeProps {
  location?: {
    state?: {
      message?: string
    }
  }
}

const Home: React.FC<HomeProps> = ({location}) => { 
  return (
    <div id="home">
      <Header hasLogo={true}>TRZ</Header>
      <main className="container">
        { location && 
          <div className="success-alert">
            {location.state?.message}
          </div> 
        }
      </main>
      <Link className="new-button" to="/new-survivor">
        Add survivor
      </Link>
    </div>
  );  
}

export default Home;