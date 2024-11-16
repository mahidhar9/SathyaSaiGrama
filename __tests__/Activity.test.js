import 'react-native';
import React from 'react';
import DotsBlinkingLoaderEllipsis from '../src/components/DotsBlinkingLoaderEllipsis';
// // Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer(<DotsBlinkingLoaderEllipsis />);
// });
import { render, screen, userEvent } from '@testing-library/react-native';


// It is recommended to use userEvent with fake timers
// Some events involve duration so your tests may take a long time to run.
jest.useFakeTimers();

test('form submits two answers', async () => {
//   const questions = ['q1', 'q2'];
//   const onSubmit = jest.fn();

//   const user = userEvent.setup();
  render(<DotsBlinkingLoaderEllipsis  />);

//   const answerInputs = screen.getByTestId('loader');
  const testDisplay = screen.getAllByText('Sairam');

  // simulates the user focusing on TextInput and typing text one char at a time
//   await user.type(answerInputs[0], 'a1');
//   await user.type(answerInputs[1], 'a2');

  // simulates the user pressing on any pressable element
//   await user.press(screen.getByRole('button', { name: 'Submit' }));

//   expect(answerInputs).toBeDefined();
  expect(testDisplay).toBeDefined();
});