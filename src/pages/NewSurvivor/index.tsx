import React, { useEffect, MouseEvent, FormEvent } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
import publicIp from 'public-ip';
import vincentyDirect from 'turf-vincenty-direct';

import api from '../../services/api';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Select from '../../components/Select';
import ipLocation from '../../services/ipLocation';
import SelectableItem from '../../components/SelectableItem';

import fijiWaterIcon from '../../assets/images/items/fiji-water.svg';
import campbellSoupIcon from '../../assets/images/items/campbell-soup.svg';
import firstAidIcon from '../../assets/images/items/first-aid.svg';
import ak47Icon from '../../assets/images/items/ak47.svg';

import './styles.css';
import mapStyles from '../../utils/mapStyles';

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

function NewSurvivor() {
  const history = useHistory();

  const [map, setMap] = React.useState<google.maps.Map | undefined>();

  const [lat, setLat] = React.useState(0);
  const [lon, setLon] = React.useState(0);
  const [zoom, setZoom] = React.useState(10);
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState(0);
  const [gender, setGender] = React.useState('');
  const [inventory, setInventory] = React.useState([
    { itemIdentifier: 'fiji_water', itemName: 'Fiji Water', quantity: 0, icon: fijiWaterIcon },
    { itemIdentifier: 'campbell_soup', itemName: 'Campbell Soup', quantity: 0, icon: campbellSoupIcon },
    { itemIdentifier: 'first_aid', itemName: 'First Aid Pouch', quantity: 0, icon: firstAidIcon },
    { itemIdentifier: 'ak47', itemName: 'AK47', quantity: 0, icon: ak47Icon }
  ]);
  const [alerts, setAlerts] = React.useState<InputAlertInterface[]>([]);

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

    fetchIpLocation();
  }, [setLat, setLon]);

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

  const handleItemQuantityChange = (e: MouseEvent) => {
    const itemIdentifier = e.currentTarget.getAttribute('data-itemidentifier');
    const operation = e.currentTarget.getAttribute('data-operation');
    const inventoryAux = inventory.slice();
    const item = inventory.findIndex(e => e.itemIdentifier === itemIdentifier);

    if (operation === '+') {
      inventoryAux[item].quantity++;
    }

    if (operation === '-') {
      if (inventoryAux[item].quantity > 0) {
        inventoryAux[item].quantity--;
      }
    }

    setInventory(inventoryAux);
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

    let items = '';
    inventory.forEach((item, key) => {
      if (item.quantity > 0) {
        items += `${item.itemName}:${item.quantity};`
      }
    });
    items = items.substr(0, items.length - 1);

    await api.post('/api/people.json', {
      person: {
        name,
        age: Number(age), 
        gender,
        lonlat
      },
      items
    }).then((response) => {
      if (response.status ===  201) {
        history.push('/', { message: 'Survivor registered' });
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

  return (
    <div id="new-survivor" className="container">
      <Header>Register survivor</Header>
      <form onSubmit={ handleSubmit }>
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
          defaultValue={gender}
          onChange={e => setGender(e.target.value)}
        />

        <div className="location-input">
          <p>Pin your location</p>
          { renderMap() }
        </div>

        <div className="inventory">
          <p>Select your equipment</p>
          <div className="bag">
            <SelectableItem
              itemName="Fiji Water"
              itemIdentifier="fiji_water"
              quantity={inventory[0].quantity}
              icon={fijiWaterIcon}
              onClick={handleItemQuantityChange}
            />
            <SelectableItem
              itemName="Campbell Soup"
              itemIdentifier="campbell_soup"
              quantity={inventory[1].quantity}
              icon={campbellSoupIcon}
              onClick={handleItemQuantityChange}
            />
            <SelectableItem
              itemName="First Aid Pouch"
              itemIdentifier="first_aid"
              quantity={inventory[2].quantity}
              icon={firstAidIcon}
              onClick={handleItemQuantityChange}
            />
            <SelectableItem
              itemName="AK47"
              itemIdentifier="ak47"
              quantity={inventory[3].quantity}
              icon={ak47Icon}
              onClick={handleItemQuantityChange}
            />
          </div>
        </div>
        <div className="submit-container">
          <button type="submit" className="submit-button">Register</button>
        </div>
      </form>
    </div>
  )
}

export default NewSurvivor;