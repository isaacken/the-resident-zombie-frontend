import React from 'react';
import { render } from '@testing-library/react';
import Home from '.';
import App from '../../App';

test('display title', () => {
  const screen = render(<App />);
  // const element = screen.getBy...()
  // expect(element).to...();
});