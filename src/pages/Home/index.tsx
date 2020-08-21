import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import publicIp from 'public-ip';
import * as Icon from 'react-feather';

import Header from '../../components/Header';

import ipLocation from '../../services/ipLocation';
import mapStyles from '../../utils/mapStyles';
import { Survivor } from '../../components/Person';
import api from '../../services/api';

import survivorIcon from '../../assets/images/survivor.png';
import zombieIcon from '../../assets/images/zombie.png';

import './styles.css';

interface HomeProps {
  location?: {
    state?: {
      message?: string
    }
  }
}

const Home: React.FC<HomeProps> = ({location}) => { 
  const [, setMap] = React.useState<google.maps.Map | undefined>();
  const [lat, setLat] = React.useState(0);
  const [lon, setLon] = React.useState(0);
  const [people, setPeople] = React.useState<Survivor[]>();

  const renderMap = () => {
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyDQmtfaqwvyghwFiG7Df0oz1Pny5MfjYHM"
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '70vh' }}
          center={{ lat: lat, lng: lon }}
          options={{
            zoom: 10,
            streetViewControl: false,
            mapTypeControl: false,
            styles: mapStyles
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {people?.map((person, key) => {
            let lonAux = Number(person.lonlat.substr(person.lonlat.indexOf('(') + 1, person.lonlat.lastIndexOf(' ') - person.lonlat.indexOf('(') - 1));      
            let latAux = Number(person.lonlat.substr(person.lonlat.lastIndexOf(' ') + 1, person.lonlat.indexOf(')') - person.lonlat.lastIndexOf(' ') - 1));

            return (
              <Marker 
                key={key}
                position={{lat: latAux, lng: lonAux}} 
                title={person.name}
                label={{
                  text: person.name,
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
                icon={{
                  url: person.infected? zombieIcon : survivorIcon,
                }}
              />
            );
          }
          )}
        </GoogleMap>
      </LoadScript>
    );
  }

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(undefined);
  }, []);

  useEffect(() => {
    async function fetchIpLocation() {
      await ipLocation.get(`json.gp?ip=${publicIp.v4()}`).then(function(response) {
        setLat(Number(response.data.geoplugin_latitude));
        setLon(Number(response.data.geoplugin_longitude));
      });
    }

    async function getPeople () {
      const response = await api.get('api/people.json');
      const data: Survivor[] = response.data;
      
      let peopleAux: Survivor[] = [];
  
      data.forEach(person => {
        peopleAux.push(person);
      });
  
      setPeople(peopleAux);
    }

    fetchIpLocation();
    getPeople();
  }, [setLat, setLon]);

  return (
    <div id="home">
      <Header hasLogo={true}>TRZ</Header>
      <main className="container">
        { location?.state?.message && 
          <div className="success-alert">
            {location.state?.message}
          </div> 
        }
        <div className="content">
          <div className="map">
            { renderMap() }
          </div>
          <div className="menu">
            <Link className="button" to="/new-survivor">
              <Icon.Plus className="icon" /> Add survivor
            </Link>
            <Link className="button" to="/update-location">
              <Icon.MapPin className="icon" /> Update location
            </Link>
            <Link className="button" to="/flag-infected">
              <Icon.Flag className="icon" /> Flag infected
            </Link>
            <Link className="button" to="/trade-items">
              <Icon.Share2 className="icon" /> Trade items
            </Link>
            <Link className="button" to="/reports">
              <Icon.BarChart2 className="icon" /> Reports
            </Link>
            <Link className="button" to="/about">
              <Icon.Info className="icon" /> About
            </Link>
          </div>
        </div>
      </main>
    </div>
  );  
}

export default Home;