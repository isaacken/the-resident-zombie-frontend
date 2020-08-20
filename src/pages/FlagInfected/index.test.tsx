import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FlagInfected from '.';

test('display header', () => {
  const screen = render(<FlagInfected />, {wrapper: MemoryRouter});
  const label = screen.getByText(/flag infected/i);

  expect(label).toBeVisible();
});

test('display survivor key input', () => {
  const screen = render(<FlagInfected />, {wrapper: MemoryRouter});

  const keyInput = screen.getByLabelText(/identify yourself/i);

  expect(keyInput).toBeVisible();
});
