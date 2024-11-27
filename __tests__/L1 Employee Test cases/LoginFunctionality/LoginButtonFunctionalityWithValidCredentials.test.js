import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../../../src/screens/Login';
import UserContext from '../../../context/UserContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../src/auth/firebaseConfig';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {
      email: 'saitejads2000@gmail.com',
    },
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

describe('Login', () => {
  test('Verify login button functionality with valid email and password', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <Login navigation={mockNavigation} />
      </UserContext.Provider>
    );

    // Step 1: Enter a valid email in the "Email Address" field
    fireEvent.changeText(getByPlaceholderText('Email Address'), 'saitejads2000@gmail.com');

    // Step 2: Enter a valid password in the "Password" field
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');

    // Step 3: Click on the "Login" button
    fireEvent.press(getByText('Login'));

    // Step 4: Verify the user is redirected to the dashboard/home page
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Dashboard');
    }, { timeout: 10000 });
  }, 20000);
});