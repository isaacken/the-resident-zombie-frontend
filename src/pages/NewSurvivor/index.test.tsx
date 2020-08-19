import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import NewSurvivor from '.';

test('display all text and select inputs', () => {
  const screen = render(<NewSurvivor />, {wrapper: MemoryRouter});
  const nameInput = screen.getByLabelText(/name/i);
  const ageInput = screen.getByLabelText(/age/i);
  const genderSelect = screen.getByLabelText(/gender/i);

  expect(nameInput).toBeVisible();
  expect(ageInput).toBeVisible();
  expect(genderSelect).toBeVisible();
});

test('display the maps div', () => {
  const screen = render(<NewSurvivor />, {wrapper: MemoryRouter});
  const label = screen.getByText(/pin your location/i);

  expect(label).toBeVisible();
});

test('display the selectable inventory items', () => {
  const screen = render(<NewSurvivor />, {wrapper: MemoryRouter});
  const fijiWater = screen.getByText(/fiji water/i);
  const campbellSoup = screen.getByText(/campbell soup/i);
  const firstAid = screen.getByText(/first aid pouch/i);
  const ak47 = screen.getByText(/ak47/i);

  expect(fijiWater).toBeVisible();
  expect(campbellSoup).toBeVisible();
  expect(firstAid).toBeVisible();
  expect(ak47).toBeVisible();
});

test('increment item counter', () => {
  const screen = render(<NewSurvivor />, {wrapper: MemoryRouter});
  const incrementButton = screen.getAllByText(/\+/i);

  userEvent.click(incrementButton[0]);

  const quantity = screen.getByText(/quantity: 1/i);

  expect(quantity).toBeVisible();
});