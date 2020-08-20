import React from 'react';

import './styles.css';

export interface Survivor {
  id: string,
  name: string,
  age: number,
  gender: string,
  lonlat: string,
  infected: boolean,
  location: string
}

interface PersonProps {
  person: Survivor
}

const Person: React.FC<PersonProps> = ({person, children}) => {
  return (
    <div className="person">
        <div className="person-data">
          <p className="person-name">{person.name}</p>
          <p className="person-details">{person.age}, { person.gender === 'M'? 'Male':'Female' }</p>
        </div>                   
        <div className="person-actions">
          {children}
        </div>
      </div>
  );
}

export default Person;