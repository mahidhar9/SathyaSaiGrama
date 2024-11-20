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
    code: 'auth/invalid-email',
    message: 'That email address is invalid.',
  }),
}));

const mockNavigation = { navigate: jest.fn() };

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

test('Verify that an error message is displayed for invalid email and password', async () => {
  const { getByPlaceholderText, getByText } = render(
    <UserContext.Provider value={mockUserContextValue}>
      <Login navigation={mockNavigation} />
    </UserContext.Provider>
  );

  // Step 1: Enter an invalid email in the "Email Address" field
  fireEvent.changeText(getByPlaceholderText('Email Address'), 'saitejads2001@gmail.com');

  // Step 2: Enter an invalid password in the "Password" field
  fireEvent.changeText(getByPlaceholderText('Password'), '12345678');

  // Step 3: Click on the "Login" button
  fireEvent.press(getByText('Login'));

  // Step 4: Verify the error message is displayed
  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith('That email address is invalid.');
  });
});