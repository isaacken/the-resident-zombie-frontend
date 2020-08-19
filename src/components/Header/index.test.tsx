import React from 'react';
import { render } from '@testing-library/react';

import Header from '.';
import App from '../../App';

test('display title', () => {
  const screen = render(<App />);
  const title = screen.getByText(/trz/i);

  expect(title).toBeVisible();
});

test('display logo icon', () => {
  const screen = render(<Header hasLogo={true}>TRZ</Header>);
  const title = screen.getByText(/trz/i);

  expect(title).toBeVisible();
});