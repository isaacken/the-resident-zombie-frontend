import React, { FormEvent, ChangeEvent } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
import vincentyDirect from 'turf-vincenty-direct';

import api from '../../services/api';
import Header from '../../components/Header';
import Input from '../../components/Input';

import './styles.css';
import Select from '../../components/Select';
import mapStyles from '../../utils/mapStyles';
import ipLocation from '../../services/ipLocation';
import publicIp from 'public-ip';

export interface InputAlertInterface {
  field: string;
  error: string;
}

interface ErrorInterface {
  0: string,
  1: {
    0: string
  }
}

function UpdateLocation() {
  const history = useHistory();

  const [map, setMap] = React.useState<google.maps.Map | undefined>();

  const [lat, setLat] = React.useState(0);
  const [lon, setLon] = React.useState(0);
  const [zoom, setZoom] = React.useState(10);
  const [id, setId] = React.useState('');
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState(0);
  const [gender, setGender] = React.useState('');
  const [alerts, setAlerts] = React.useState<InputAlertInterface[]>([]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(undefined);
  }, []);

  const handleMapClick = (e: google.maps.MouseEvent) => {
    setLat(e.latLng.lat());
    setLon(e.latLng.lng());
  }

  const renderMap = () => {
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyDQmtfaqwvyghwFiG7Df0oz1Pny5MfjYHM"
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '40rem' }}
          center={{ lat: lat, lng: lon }}
          options={{
            zoom,
            streetViewControl: false,
            mapTypeControl: false,
            styles: mapStyles
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          onZoomChanged={() => { setZoom(map?.getZoom() || 0) }}
        >
          <Marker position={{lat: lat, lng: lon}} />
        </GoogleMap>
      </LoadScript>
    );
  }

  const shiftCoordinates = (lat: number, lon: number) => {
    const point = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      }
    };
    // Although the unit is set below as kilometers, the distance 
    // should be passed in meters in order to the library work properly
    const distance = 10000;
    const bearing = 0;
    const units = 'kilometers';

    const destination = vincentyDirect(point, distance, bearing, units);

    return destination;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const shiftedCoordinates = shiftCoordinates(lat, lon).geometry.coordinates;
    const lonlat = `Point(${shiftedCoordinates[1]} ${shiftedCoordinates[0]})`;

    await api.patch(`/api/people/${id}.json`, {
      person: {
        name,
        age: Number(age), 
        gender,
        lonlat
      }
    }).then((response) => {
      if (response.status ===  200) {
        history.push('/', { message: 'Survivor updated' });
      }
    }).catch((error) => {
      const errors = Object.entries<ErrorInterface>(error.response.data);        

      errors.forEach((item) => {
        const alert = {
          field: item[0],
          error: item[1][0]
        }

        setAlerts([...alerts, alert]);
      });

      window.scroll({ top: 0, behavior: 'smooth' });
    });
  }

  const handleUuidChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);

    if (e.target.value.length !== 36) {
      return;
    }

    const response = await api.get(`api/people/${e.target.value}.json`);
    const data = response.data;

    setName(data.name);
    setAge(data.age);
    setGender(data.gender);
    
    if (data.lonlat) {
      let lonlat = data.lonlat;
      let lonAux = lonlat.substr(lonlat.indexOf('(') + 1, lonlat.lastIndexOf(' ') - lonlat.indexOf('(') - 1);
      lonAux = Number(lonAux);
      setLon(lonAux);

      let latAux = lonlat.substr(lonlat.lastIndexOf(' ') + 1, lonlat.indexOf(')') - lonlat.lastIndexOf(' ') - 1);
      latAux = Number(latAux);
      setTimeout(() => setLat(latAux), 1000);
    } else {
      ipLocation.get(`json.gp?ip=${publicIp.v4()}`).then(function(response) {
        setLat(Number(response.data.geoplugin_latitude));
        setLon(Number(response.data.geoplugin_longitude));
      });
    }
  }

  return (
    <div id="update-location" className="container">
      <Header>Update location</Header>
      <div className="survivor-key">
        <Input
          name="id"
          label="Survivor key"
          value={id}
          onChange={handleUuidChange}
          error={alerts.find((item) => item.field === 'id')}
        />
      </div>
      <form onSubmit={ handleSubmit }>
        {name && <>
          <p style={{marginBottom: 10}}>Take the opportunity to update your data</p>
          <Input
            name="name"
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            error={alerts.find((item) => item.field === 'name')}
          />

          <Input
            name="age"
            label="Age"
            type="number"
            value={age}
            min={0}
            onChange={e => setAge(Number(e.target.value))}
            error={alerts.find((item) => item.field === 'age')}
          />

          <Select
            name="gender"
            label="Gender"
            options={[
              { value: 'M', label: 'Male' },
              { value: 'F', label: 'Female' },
            ]} 
            value={gender}
            onChange={e => setGender(e.target.value)}
          />

          <div className="location-input">
            <p>Pin your location</p>
            { renderMap() }
          </div>

          <div className="submit-container">
            <button type="submit" className="submit-button">Update</button>
          </div>
        </> }
      </form>
    </div>
  )
}

export default UpdateLocation;