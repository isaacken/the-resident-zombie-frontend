import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import About from '.';


test('display header', () => {
  const screen = render(<About />, {wrapper: MemoryRouter});
  const label = screen.getByTestId('freepik-links');

  expect(label).toBeVisible();
});