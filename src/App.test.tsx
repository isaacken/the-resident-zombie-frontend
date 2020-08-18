import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the proper page according to route', () => {
  const { getByText } = render(<App />);
});
