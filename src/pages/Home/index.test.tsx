import React from 'react';
import { render } from '@testing-library/react';

import App from '../../App';

test('display add survivor button', () => {
  const screen = render(<App />);
  const addSurvivorButton = screen.getByText(/add survivor/i);
  expect(addSurvivorButton).toBeVisible();
});