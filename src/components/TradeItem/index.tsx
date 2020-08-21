import React from 'react';

import * as Icon from 'react-feather';

import './styles.css';

interface TradeItemProps {
  itemIdentifier: string;
  itemName: string;
  quantity: number;
  quantitySelected: number;
  icon: string;
  points: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const TradeItem: React.FC<TradeItemProps> = ({itemIdentifier, itemName, quantity, quantitySelected, icon, points, onClick}) => {
  return (
    <div className="trade-item">
      <div className="trade-item-details">
        <figure className="trade-item-image">
          <img src={icon} alt={`${itemName} icon`} />
        </figure>
        <div className="trade-item-data">
          <p className="trade-item-name">{itemName}</p>
          <p className="trade-item-value">${points}</p>
        </div>
      </div>
      <div className="trade-item-controls">
        <div className="button-container">
          <button 
            title="Add item to trade"
            type="button"
            className="trade-item-button"
            data-itemidentifier={itemIdentifier}
            data-operation="+"
            data-testid="add-item"
            onClick={onClick}
          >
            <Icon.ChevronUp className="icon" />
          </button>
        </div>
        <div className="trade-item-quantity">
          {quantitySelected} / {quantity}
        </div>
        <div className="button-container">
          <button 
            title="Remove item from trade"
            type="button"
            className="trade-item-button"
            data-itemidentifier={itemIdentifier}
            data-operation="-"
            data-testid="remove-item"
            onClick={onClick}
          >
            <Icon.ChevronDown className="icon" />
          </button>
        </div>
      </div> 
    </div>  
  );
}

export default TradeItem;