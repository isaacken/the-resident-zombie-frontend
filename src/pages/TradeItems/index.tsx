import React, { ChangeEvent, useState, useEffect, MouseEvent, FormEvent } from 'react';

import Header from '../../components/Header';
import Input from '../../components/Input';
import { Survivor } from '../../components/Person';
import TradeItem from '../../components/TradeItem';

import api from '../../services/api';
import extractIdFromUrl from '../../utils/extractIdFromUrl';

import fijiWaterIcon from '../../assets/images/items/fiji-water.svg';
import campbellSoupIcon from '../../assets/images/items/campbell-soup.svg';
import firstAidIcon from '../../assets/images/items/first-aid.svg';
import ak47Icon from '../../assets/images/items/ak47.svg';

import './styles.css';
import { useHistory } from 'react-router-dom';

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

interface Property {
  item: {
    name: string,
    points: number
  },
  quantity: number
}

function TradeItems() {
  const baseInventory = [
    { itemIdentifier: 'fiji_water', itemName: 'Fiji Water', quantity: 0, quantitySelected: 0, icon: fijiWaterIcon, points: 14},
    { itemIdentifier: 'campbell_soup', itemName: 'Campbell Soup', quantity: 0, quantitySelected: 0, icon: campbellSoupIcon, points: 12 },
    { itemIdentifier: 'first_aid', itemName: 'First Aid Pouch', quantity: 0, quantitySelected: 0, icon: firstAidIcon, points: 10 },
    { itemIdentifier: 'ak47', itemName: 'AK47', quantity: 0, quantitySelected: 0, icon: ak47Icon, points: 8 }
  ];

  const history = useHistory();

  const [id, setId] = useState('');
  const [traderName, setTraderName] = useState('');
  const [user, setUser] = React.useState<Survivor>();
  const [trader, setTrader] = React.useState<Survivor>();
  const [alerts, setAlerts] = React.useState<InputAlertInterface[]>([]);  
  const [people, setPeople] = React.useState<Survivor[]>();
  const [userInventory, setUserInventory] = React.useState(baseInventory);
  const [traderInventory, setTraderInventory] = React.useState(baseInventory);
  const [userOfferTotal, setUserOfferTotal] = React.useState(0);
  const [userPickTotal, setUserPickTotal] = React.useState(0);
  const [canTrade, setCanTrade] = React.useState(false);

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

  const handleUserUuidChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setCanTrade(false);

    if (e.target.value.length !== 36) {
      setUser(undefined);
      return;
    }

    const response = await api.get(`api/people/${e.target.value}.json`);
    const data = response.data;

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

    const properties = await api.get(`api/people/${data.id}/properties.json`);
    
    let userInventoryAux = baseInventory;
    properties.data.forEach((property: Property) => {
      let itemIndex = userInventoryAux.findIndex((i) => i.itemName === property.item.name);
      userInventoryAux[itemIndex].points = property.item.points;
      userInventoryAux[itemIndex].quantity = property.quantity;
    });
    setUserInventory(userInventoryAux);
    
    let peopleAux = await getPeople();

    peopleAux = peopleAux?.filter((person) => {
      let location = person.location;
      let personId = extractIdFromUrl(location);
      
      return personId !== data.id;
    });

    setPeople(peopleAux);
  }

  const handleTraderNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setTraderName(e.target.value);
    setCanTrade(false);

    let person = people?.find((person) => person.name === e.target.value )
    if (person) {
      person.id = extractIdFromUrl(person.location);
      setTrader(person);

      const properties = await api.get(`api/people/${person.id}/properties.json`);
    
      let traderInventoryAux = baseInventory;
      properties.data.forEach((property: Property) => {
        let itemIndex = traderInventoryAux.findIndex((i) => i.itemName === property.item.name);
        traderInventoryAux[itemIndex].points = property.item.points;
        traderInventoryAux[itemIndex].quantity = property.quantity;
      });
      setTraderInventory(traderInventoryAux);

    } else {
      setTrader(undefined);
    }
  }

  const handleUserOfferChange = (e: MouseEvent) => {
    const itemIdentifier = e.currentTarget.getAttribute('data-itemidentifier');
    const operation = e.currentTarget.getAttribute('data-operation');
    const inventoryAux = userInventory.slice();
    const item = userInventory.findIndex(e => e.itemIdentifier === itemIdentifier);

    if (operation === '+') {
      if (inventoryAux[item].quantitySelected < inventoryAux[item].quantity) {
        inventoryAux[item].quantitySelected++;
      }
    }

    if (operation === '-') {
      if (inventoryAux[item].quantitySelected > 0) {
        inventoryAux[item].quantitySelected--;
      }
    }

    setUserInventory(inventoryAux);

    let totalPoints = 0;

    for (let i = 0; i < 4; i++) {
      totalPoints += inventoryAux[i].quantitySelected * inventoryAux[i].points; 
    }

    setUserOfferTotal(totalPoints);
    setCanTrade(totalPoints === userPickTotal);
  }

  const handleUserPickChange = (e: MouseEvent) => {
    const itemIdentifier = e.currentTarget.getAttribute('data-itemidentifier');
    const operation = e.currentTarget.getAttribute('data-operation');
    const inventoryAux = traderInventory.slice();
    const item = traderInventory.findIndex(e => e.itemIdentifier === itemIdentifier);

    if (operation === '+') {
      if (inventoryAux[item].quantitySelected < inventoryAux[item].quantity) {
        inventoryAux[item].quantitySelected++;
      }
    }

    if (operation === '-') {
      if (inventoryAux[item].quantitySelected > 0) {
        inventoryAux[item].quantitySelected--;
      }
    }

    setTraderInventory(inventoryAux);

    let totalPoints = 0;

    for (let i = 0; i < 4; i++) {
      totalPoints += inventoryAux[i].quantitySelected * inventoryAux[i].points; 
    }

    setUserPickTotal(totalPoints);
    setCanTrade(totalPoints === userOfferTotal);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userOfferTotal !== userPickTotal || !user || !trader) {
      return;
    }

    let pick = '';
    traderInventory.forEach((item, key) => {
      if (item.quantitySelected > 0) {
        pick += `${item.itemName}:${item.quantitySelected};`
      }
    });
    pick = pick.substr(0, pick.length - 1);

    let payment = '';
    userInventory.forEach((item, key) => {
      if (item.quantitySelected > 0) {
        payment += `${item.itemName}:${item.quantitySelected};`
      }
    });
    payment = payment.substr(0, payment.length - 1);

    api.post(`/api/people/${trader.id}/properties/trade_item.json`, {
      consumer: {
        name: user.name,
        pick: pick,
        payment: payment
      }
    }).then((response) => {
      if (response.status ===  204) {
        history.push('/', { message: 'Transaction succeeded' });
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
    <div id="trade-items" className="container">
      <Header>Trade items</Header>

      <div className="survivor-key">
        <Input
          name="id"
          label="Identify yourself"
          value={id}
          onChange={handleUserUuidChange}
          error={alerts.find((item) => item.field === 'id')}
        />

        <Input
          name="trader-name"
          label="Who will you trade with?"
          value={traderName}
          onChange={handleTraderNameChange}
          error={alerts.find((item) => item.field === 'trader-name')}
          list="people-list"
          autoComplete="off"
        />

        <datalist id="people-list">
          {people?.map((person, key) => 
            <option key={key} value={person.name} />
          )}
        </datalist>
      </div>    
      { user && trader &&
        <div className="trade-details">
          <p className="trade-greetings">Hello, {user.name}.</p>
          <form onSubmit={handleSubmit}>
            <div className="trade-pick">
              <div className="trade-description">
                <p className="trade-title">What do you want?</p>
                <p className="trade-total">Total: ${userPickTotal}</p>
              </div>
              <div className="trade-items-list">
                {traderInventory.map((item, key) => 
                  <TradeItem
                    key={key}
                    itemName={traderInventory[key].itemName}
                    itemIdentifier={traderInventory[key].itemIdentifier}
                    quantity={traderInventory[key].quantity}
                    quantitySelected={traderInventory[key].quantitySelected}
                    icon={traderInventory[key].icon}
                    points={traderInventory[key].points}
                    onClick={handleUserPickChange}
                  />
                )}
              </div>
            </div>
            <div className="trade-offer">
              <div className="trade-description">
                <p className="trade-title">What will you offer in return to {trader.name}?</p>
                <p className="trade-total">Total: ${userOfferTotal}</p>
              </div>
              <div className="trade-items-list">
                {userInventory.map((item, key) => 
                  <TradeItem
                    key={key}
                    itemName={userInventory[key].itemName}
                    itemIdentifier={userInventory[key].itemIdentifier}
                    quantity={userInventory[key].quantity}
                    quantitySelected={userInventory[key].quantitySelected}
                    icon={userInventory[key].icon}
                    points={userInventory[key].points}
                    onClick={handleUserOfferChange}
                  />
                )}
              </div>
            </div>
            { canTrade?
              <div className="submit-container">
                <button type="submit" className="submit-button">Trade</button>
              </div>
              :
              <div className="trade-note">Note: You can only trade when the item total values match.</div>
            }
          </form>
        </div> 
      }  
    </div>
  );
}

export default TradeItems;
