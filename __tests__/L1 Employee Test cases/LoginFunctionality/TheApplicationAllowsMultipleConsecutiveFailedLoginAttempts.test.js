import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../../../src/screens/Login';
import UserContext from '../../../context/UserContext';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('../../../src/auth/firebaseConfig', () => ({
  signInWithEmailAndPassword: jest.fn().mockRejectedValue({
    code: 'auth/wrong-password',
    message: 'The password is invalid or the user does not have a password.',
  }),
}));


const mockUserContextValue = {
    userType: 'admin',
    setUserType: jest.fn(),
    accessToken: 'mockAccessToken123',
    setUserEmail: jest.fn(),
    setL1ID: jest.fn(),
    loggedUser: { name: 'John Doe' },
    setLoggedUser: jest.fn(),
    deviceToken: 'mockDeviceToken456',
    resident: { id: 'r123', name: 'Jane Resident' },
    setResident: jest.fn(),
    setProfileImage: jest.fn(),
    employee: { id: 'e789', name: 'Alice Employee' },
    setEmployee: jest.fn(),
    testResident: { id: 't987', name: 'Test Resident' },
    setTestResident: jest.fn(),
    departmentIds: ['d1', 'd2', 'd3'],
    setDepartmentIds: jest.fn(),
  };
  
const mockNavigation = { navigate: jest.fn() };



test('Verify that the user can make multiple consecutive failed login attempts', async () => {
  const { getByPlaceholderText, getByText } = render(
    <UserContext.Provider value={mockUserContextValue}>
      <Login navigation={mockNavigation} />
    </UserContext.Provider>
  );

  // Step 1: Enter a valid email in the "Email Address" field
  fireEvent.changeText(getByPlaceholderText('Email Address'), 'saitejads2000@gmail.com');

  // Step 2: Enter an incorrect password in the "Password" field
  for (let i = 0; i < 5; i++) {
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    // Step 3: Verify the error message is displayed
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'The password is invalid or the user does not have a password.'
      );
    });
  }

  // Verify that the application allows multiple failed login attempts
  expect(Alert.alert).toHaveBeenCalledTimes(5);
});