import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Home from '.';

test('display add survivor button', () => {
  const screen = render(<Home />, {wrapper: MemoryRouter});
  const addSurvivorButton = screen.getByText(/add survivor/i);
  expect(addSurvivorButton).toBeVisible();
});

test('display success message', () => {
  const screen = render(
    <Home
      location={{
        state: {
          message: 'Survivor registered'
        }
      }}
    />, {wrapper: MemoryRouter}
  );

  const successAlert = screen.getByText(/survivor registered/i)

  expect(successAlert).toBeVisible();
});