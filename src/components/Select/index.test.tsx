import React from 'react';
import { render } from '@testing-library/react';

import Select from '.';

test('display label', () => {
  const element = render(<Select name="test" label="Test" options={[]} />);
  const label = element.getByLabelText(/Test/);

  expect(label).toBeVisible();
});