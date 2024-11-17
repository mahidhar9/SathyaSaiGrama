import 'react-native';
import React from 'react';
import DotsBlinkingLoaderEllipsis from '../src/components/DotsBlinkingLoaderEllipsis';
// // Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';


import { render, screen, userEvent } from '@testing-library/react-native';


jest.useFakeTimers();

test('form submits two answers', async () => {

  render(<DotsBlinkingLoaderEllipsis  />);

  const testDisplay = screen.getAllByText('Sairam');


  expect(testDisplay).toBeDefined();
});