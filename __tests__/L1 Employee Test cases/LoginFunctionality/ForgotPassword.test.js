import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPassword from '../../../src/screens/ForgotPassword';
import UserContext from '../../../context/UserContext';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../../src/auth/firebaseConfig';
import { openInbox } from 'react-native-email-link';

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue({}),
  fetchSignInMethodsForEmail: jest.fn().mockResolvedValue(['password']),
}));

jest.mock('react-native-email-link', () => jest.fn());

jest.mock('../../../src/auth/firebaseConfig', () => ({
  auth: {
    sendPasswordResetEmail: jest.fn(),
  },
  getReactNativePersistence: jest.fn(),
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

test('Verify that the user can access the "Forgot Password" functionality', async () => {
  const { getByText, getByPlaceholderText } = render(
    <UserContext.Provider value={mockUserContextValue}>
      <ForgotPassword navigation={mockNavigation} />
    </UserContext.Provider>
  );

  // Step 1: Enter a valid email address
  fireEvent.changeText(getByPlaceholderText('Email for Password Reset'), 'saitejads2000@gmail.com');

  // Step 2: Submit the request
  fireEvent.press(getByText('Send'));

  // Step 3: Verify the user receives a password reset link via email
  await waitFor(() => {
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'saitejads2000@gmail.com');
  });

  // Step 4: Verify the success message is displayed
  await waitFor(() => {
    expect(getByText('A password reset link is sent to your registered email')).toBeTruthy();
  });
});