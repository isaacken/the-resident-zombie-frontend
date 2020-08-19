import React from 'react';
import { render } from '@testing-library/react';

import Input from '.';

test('display label', () => {
  const screen = render(<Input name="test" label="Test" />);
  const label = screen.getByLabelText(/Test/);

  expect(label).toBeVisible();
});