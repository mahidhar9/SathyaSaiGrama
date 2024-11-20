import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../../../src/screens/Login';
import UserContext from '../../../context/UserContext';

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

test('Verify the visibility toggle for the password field', () => {
  const { getByPlaceholderText, getByTestId } = render(
    <UserContext.Provider value={mockUserContextValue}>
      <Login navigation={mockNavigation} />
    </UserContext.Provider>
  );

  // Step 1: Open the application and enter a password in the "Password" field
  const passwordInput = getByPlaceholderText('Password');
  fireEvent.changeText(passwordInput, 'password123');

  // Step 2: Click on the eye icon to toggle visibility
  const eyeIcon = getByTestId('eye');
  fireEvent.press(eyeIcon);

  // Step 3: Observe the password visibility
  expect(passwordInput.props.secureTextEntry).toBe(false);

  // Step 4: Click on the eye icon again to toggle visibility back
  fireEvent.press(eyeIcon);
  expect(passwordInput.props.secureTextEntry).toBe(true);
});