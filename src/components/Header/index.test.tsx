import React from 'react';
import { render } from '@testing-library/react';

import Header from '.';

test('display title', () => {
  const screen = render(<Header />);
  const title = screen.getByText('TRZ');

  expect(title).toBeVisible();
});