import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';

import Header from '../../components/Header';

import './styles.css';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import ipLocation from '../../services/ipLocation';
import publicIp from 'public-ip';
import mapStyles from '../../utils/mapStyles';

interface HomeProps {
  location?: {
    state?: {
      message?: string
    }
  }
}

const Home: React.FC<HomeProps> = ({location}) => { 
  const [, setMap] = React.useState(null);
  const [lat, setLat] = React.useState(0);
  const [lon, setLon] = React.useState(0);

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
        />
      </LoadScript>
    );
  }

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    async function fetchIpLocation() {
      await ipLocation.get(`json.gp?ip=${publicIp.v4()}`).then(function(response) {
        setLat(Number(response.data.geoplugin_latitude));
        setLon(Number(response.data.geoplugin_longitude));
      });
    }

    fetchIpLocation();
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
            <Link className="button" to="/">
              <Icon.Flag className="icon" /> Flag infected
            </Link>
            <Link className="button" to="/">
              <Icon.Share2 className="icon" /> Trade items
            </Link>

            <Link className="button" to="/">
              <Icon.Info className="icon" /> About
            </Link>
          </div>
        </div>
      </main>
    </div>
  );  
}

export default Home;