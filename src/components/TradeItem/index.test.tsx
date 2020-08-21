import React, { MouseEvent } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TradeItem from '.';

import fijiWaterIcon from '../../assets/images/items/fiji-water.svg';

test('display item name', () => {
  const element = render(<TradeItem
    itemName="Fiji Water"
    itemIdentifier="fiji_water"
    quantity={0}
    quantitySelected={0}
    points={14}
    icon={fijiWaterIcon}
  />);
  
  const label = element.getByText(/fiji water/i);

  expect(label).toBeVisible();
});

test('display item icon', () => {
  const element = render(<TradeItem
    itemName="Fiji Water"
    itemIdentifier="fiji_water"
    quantity={0}
    quantitySelected={0}
    points={14}
    icon={fijiWaterIcon}
  />);

  const label = element.getByAltText(/fiji water icon/i);

  expect(label).toBeInTheDocument();
});

test('display the right quantity', () => {
  const element = render(<TradeItem
    itemName="Fiji Water"
    itemIdentifier="fiji_water"
    quantity={10}
    quantitySelected={2}
    points={14}
    icon={fijiWaterIcon}
  />);

  const label = element.getByText(/2 \/ 10/i);

  expect(label).toBeInTheDocument();
});


test('fire event when click on plus', () => {
  let operation: string | null = '';
  const handleClick = (e: MouseEvent) => {
    operation = e.currentTarget.getAttribute('data-operation');
  }

  const element = render(<TradeItem
    itemName="Fiji Water"
    itemIdentifier="fiji_water"
    quantity={10}
    quantitySelected={2}
    points={14}
    icon={fijiWaterIcon}
    onClick={handleClick}
  />);

  userEvent.click(element.getByTestId('add-item'));
  expect(operation).toBe('+');
});

test('fire event when click on minus', () => {
  let operation: string | null = '';
  const handleClick = (e: MouseEvent) => {
    operation = e.currentTarget.getAttribute('data-operation');
  }

  const element = render(<TradeItem
    itemName="Fiji Water"
    itemIdentifier="fiji_water"
    quantity={10}
    quantitySelected={2}
    points={14}
    icon={fijiWaterIcon}
    onClick={handleClick}
  />);

  userEvent.click(element.getByTestId('remove-item'));
  expect(operation).toBe('-');
});

