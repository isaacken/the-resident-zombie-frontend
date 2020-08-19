import React from 'react';
import { render } from '@testing-library/react';

import Input from '.';

test('display label', () => {
  const element = render(<Input name="test" label="Test" />);
  const label = element.getByLabelText(/Test/);

  expect(label).toBeVisible();
});

test('display input error', () => {
  const element = render(<Input name="thing" label="Test" error={{field: 'thing', error: 'invalid'}} />);
  const label = element.getByText(/thing invalid/);

  expect(label).toBeVisible();
});

