import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../../../src/screens/Login';
import UserContext from '../../../context/UserContext';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('../../../src/auth/firebaseConfig', () => ({
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {
      email: 'saitejads2000@gmail.com',
      emailVerified: true,
    },
  }),
}));

jest.mock('../../../src/components/ApiRequest.js', () => ({
  getDataWithString: jest.fn().mockResolvedValue({
    data: [{ ID: 'user123', Name_field: 'John Doe', Accommodation_Approval: 'APPROVED' }],
  }),
  isResident: jest.fn().mockResolvedValue(true),
  isEmployee: jest.fn().mockResolvedValue(true),
  isTestResident: jest.fn().mockResolvedValue(true),
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

test('Verify that user can login with valid email and password', async () => {
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

  // Step 4: Verify the user is successfully logged in and redirected to the dashboard/home page
  await waitFor(() => {
    expect(mockNavigation.navigate).toHaveBeenCalledWith('invite');
  },{timeout:20000});
});