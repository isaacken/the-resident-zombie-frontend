import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import UpdateLocation from '.';

test('display header', () => {
  const screen = render(<UpdateLocation />, {wrapper: MemoryRouter});
  const label = screen.getByText(/update location/i);

  expect(label).toBeVisible();
});

test('display only survivor key input on init', () => {
  const screen = render(<UpdateLocation />, {wrapper: MemoryRouter});

  const keyInput = screen.getByLabelText(/survivor key/i);

  const nameInput = screen.queryByLabelText(/name/i);
  const ageInput = screen.queryByLabelText(/age/i);
  const genderSelect = screen.queryByLabelText(/gender/i);

  expect(keyInput).toBeVisible();
  expect(nameInput).not.toBeInTheDocument();
  expect(ageInput).not.toBeInTheDocument();
  expect(genderSelect).not.toBeInTheDocument();
});

test('not display the maps div on init', () => {
  const screen = render(<UpdateLocation />, {wrapper: MemoryRouter});
  
  const label = screen.queryByText(/pin your location/i);

  expect(label).not.toBeInTheDocument();
});
