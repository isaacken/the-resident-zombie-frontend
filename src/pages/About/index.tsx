import React from 'react';

import './styles.css';
import Header from '../../components/Header';

function About() {
  return (
    <div id="about" className="container">
      <Header>About</Header>
      <div className="credits">
        <div data-testid="freepik-links">Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
      </div>
    </div>
  );
}

export default About;