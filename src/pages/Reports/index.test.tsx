import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Reports from '.';

test('display header', () => {
  const screen = render(<Reports />, {wrapper: MemoryRouter});
  const label = screen.getByText(/reports/i);

  expect(label).toBeVisible();
});

test('display infections report', () => {
  const screen = render(<Reports />, {wrapper: MemoryRouter});
  const title = screen.getByText(/infections report/i);
  const description = screen.getByText(/average of infected and non-infected people/i);

  expect(title).toBeVisible();
  expect(description).toBeVisible();
});

test('display points lost report', () => {
  const screen = render(<Reports />, {wrapper: MemoryRouter});
  const title = screen.getByText(/points lost by infected people/i);
  const description = screen.getByText(/total points lost in items that belong to infected people/i);

  expect(title).toBeVisible();
  expect(description).toBeVisible();
});

test('display people inventory report', () => {
  const screen = render(<Reports />, {wrapper: MemoryRouter});
  const title = screen.getByText(/people inventory report/i);
  const description = screen.getByText(/average of the quantity of items per person \(total and just non-infected\) and of each item/i);

  expect(title).toBeVisible();
  expect(description).toBeVisible();
});