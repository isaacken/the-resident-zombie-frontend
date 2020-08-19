import React from 'react';
import { render } from '@testing-library/react';

import Select from '.';

test('display label', () => {
  const screen = render(<Select name="test" label="Test" options={[]} />);
  const label = screen.getByLabelText(/Test/);

  expect(label).toBeVisible();
});