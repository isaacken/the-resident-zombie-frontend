import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TradeItems from '.';

test('display header', () => {
  const screen = render(<TradeItems />, {wrapper: MemoryRouter});
  const label = screen.getByText(/trade items/i);

  expect(label).toBeVisible();
});

test('display survivor key input', () => {
  const screen = render(<TradeItems />, {wrapper: MemoryRouter});

  const keyInput = screen.getByLabelText(/identify yourself/i);

  expect(keyInput).toBeVisible();
});

test('display trader name input', () => {
  const screen = render(<TradeItems />, {wrapper: MemoryRouter});

  const traderNameInput = screen.getByLabelText(/who will you trade with/i);

  expect(traderNameInput).toBeVisible();
});