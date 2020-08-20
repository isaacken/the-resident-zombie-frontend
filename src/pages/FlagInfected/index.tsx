import React, { ChangeEvent, useEffect } from 'react';

import * as Icon from 'react-feather';

import api from '../../services/api';
import Header from '../../components/Header';
import Input from '../../components/Input';

import './styles.css';
import extractIdFromUrl from '../../utils/extractIdFromUrl';

interface InputAlertInterface {
  field: string;
  error: string;
}

interface ErrorInterface {
  0: string,
  1: {
    0: string
  }
}

interface Survivor {
  id: string,
  name: string,
  age: number,
  gender: string,
  lonlat: string,
  infected: boolean,
  location: string
}

function FlagInfected() {
  const [id, setId] = React.useState('');
  const [user, setUser] = React.useState<Survivor>();
  const [people, setPeople] = React.useState<Survivor[]>();
  const [peopleResult, setPeopleResult] = React.useState<Survivor[]>();
  const [search, setSearch] = React.useState('');
  const [alerts, setAlerts] = React.useState<InputAlertInterface[]>([]);
  const [message, setMessage] = React.useState('');

  const getPeople = async () => {
    const response = await api.get('api/people.json');
    const data: Survivor[] = response.data;
    
    let peopleAux: Survivor[] = [];

    data.forEach(person => {
      if (!person.infected) {
        peopleAux.push(person);
      }
    });

    setPeople(peopleAux);
    return peopleAux;
  }

  useEffect(() => {
    getPeople();
  }, []);

  const handleUuidChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);

    if (e.target.value.length !== 36) {
      setUser(undefined);
      return;
    }

    const response = await api.get(`api/people/${e.target.value}.json`);
    const data = response.data;

    console.log(data);

    if (data.infected) {
      setUser(undefined);

      const alert = {
        field: 'id',
        error: 'owner is infected'
      }

      setAlerts([...alerts, alert]);
      return;
    }

    setUser(data);
    
    let peopleAux = await getPeople();

    peopleAux = peopleAux?.filter((person) => {
      let location = person.location;
      let personId = extractIdFromUrl(location);
      
      return personId !== data.id;
    });

    setPeople(peopleAux);
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    
    if (!e.target.value) {
      setPeopleResult(undefined);
      return;
    }

    const peopleFiltered = people?.filter((person) => {
      return person.name.normalize().toLowerCase().includes(e.target.value.toLowerCase());
    });

    setPeopleResult(peopleFiltered);
  }

  const handleFlagButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const location = e.currentTarget.dataset.location;
    if (!location) {
      return;
    }

    const infected = extractIdFromUrl(location);
    const person = people?.find((p) => {
      return p.location === location
    });

    api.post(`/api/people/${user?.id}/report_infection.json`, {
      infected
    }).then((response) => {
      console.log(response);
      setMessage(`${person?.name} reported as infected`);
    }).catch((error) => {
      if (error.response.status === 422) {
        let alertsAux = alerts;

        alertsAux = alertsAux.filter((a) => {
          return a.field !== 'infected_person_id';
        });

        const alert = {
          field: 'infected_person_id',
          error: `You already reported ${person?.name}`
        }

        alertsAux.push(alert);

        setAlerts([]);
        setAlerts(alertsAux);
      }
    });
  }

  return (
    <div id="flag-infected" className="container">
      <Header>Flag infected</Header>

      { alerts.find((item) => item.field === 'infected_person_id') && 
        <div className="error-alert">
          {alerts.find((item) => item.field === 'infected_person_id')?.error}
        </div> 
      }

      { message && 
        <div className="success-alert">
          {message}
        </div> 
      }

      <div className="survivor-key">
        <Input
          name="id"
          label="Identify yourself"
          value={id}
          onChange={handleUuidChange}
          error={alerts.find((item) => item.field === 'id')}
        />
      </div>
      
      { user &&
        <div className="people-container">
          <div className="search-people">
            <Input 
              name="search"
              label="Name the infected person"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="people-list">
            { peopleResult? 
                peopleResult.map((person, key) =>
                  <div key={key} className="person">
                    <div className="person-data">
                      <p className="person-name">{person.name}</p>
                      <p className="person-details">{person.age}, { person.gender === 'M'? 'Male':'Female' }</p>
                    </div>                   
                    <div className="person-actions">
                      <button 
                        className="flag-infected-button" 
                        title="Flag as infected"
                        data-location={person.location}
                        onClick={handleFlagButton}
                      >
                        <Icon.Flag />
                      </button>
                    </div>
                  </div>
                ) : 
                <div className="no-results">
                  No results found
                </div>
            }
          </div>
        </div>
      }
    </div>
  )
}

export default FlagInfected;