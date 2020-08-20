import React from 'react';
import { render } from '@testing-library/react';

import Person, { Survivor } from '.';

const person: Survivor = {
  id: 'id',
  name: 'John Doe',
  age: 42,
  gender: 'M',
  lonlat: '',
  infected: false,
  location: ''
}

test('display person name and details', () => {
  const element = render(
    <Person 
      person={person}
    >
      <div>
        inner content
      </div>
    </Person>
  );

  const label = element.getByText(/inner content/);

  expect(label).toBeVisible();
});

test('display props', () => {
  const element = render(
    <Person 
      person={person}
    >
      <div>
        inner content
      </div>
    </Person>
  );

  const name = element.getByText(/john doe/i);
  const details = element.getByText(/42, male/i);

  expect(name).toBeVisible();
  expect(details).toBeVisible();
});