import React from 'react';

import './styles.css';

interface SelectableItemInterface {
  itemIdentifier: string;
  itemName: string;
  quantity: number;
  icon: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SelectableItem: React.FC<SelectableItemInterface> = ({itemIdentifier, itemName, quantity, icon, onClick}) => {
  return (
    <div className="item">
      <p className="item-name">{itemName}</p>
      <img src={icon} alt={`${itemName} icon`} />
      <p className="item-quantity">Quantity: { quantity }</p>
      <div className="quantity-buttons">
        <button 
          title="Add item" 
          type="button" 
          data-operation="+" 
          data-itemidentifier={itemIdentifier} 
          onClick={onClick}
        >
          +
        </button>
        <button 
          title="Remove item" 
          type="button" 
          data-operation="-" 
          data-itemidentifier={itemIdentifier} 
          onClick={onClick}
          disabled={quantity<=0}
        >
          -
        </button>
      </div>
    </div>
  );
}

export default SelectableItem;