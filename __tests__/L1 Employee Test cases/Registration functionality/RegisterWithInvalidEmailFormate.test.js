import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../../../src/screens/Register';
import UserContext from '../../../context/UserContext';
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn(),
  initializeAuth: jest.fn(() => ({
    currentUser: null,
  })),
  createUserWithEmailAndPassword: jest.fn().mockRejectedValue({
    code: 'auth/invalid-email',
    message: 'That email address is invalid.',
  }),
  sendEmailVerification: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../src/components/ApiRequest', () => ({
  getDataWithInt: jest.fn().mockResolvedValue({
    data: [{ Accommodation_Approval: 'APPROVED', Department_Approval: 'APPROVED' }],
  }),
  getDataWithTwoInt: jest.fn().mockResolvedValue({
    data: [{ Accommodation_Approval: 'APPROVED' }],
  }),
  getDataWithString: jest.fn().mockResolvedValue({
    code: 3000,
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

describe('Register Screen', () => {
  it('shows an error message when the email format is invalid', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <Register navigation={mockNavigation} />
      </UserContext.Provider>
    );

    // Step 1: Enter a name in the "Name" field
    fireEvent.changeText(getByPlaceholderText('Name'), 'Teja');

    // Step 2: Enter an invalid email in the "Email Address" field
    fireEvent.changeText(getByPlaceholderText('Email Address'), 'saitejads2000@');

    // Step 3: Enter a valid password in the "Password" field
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');

    // Step 4: Enter the same password in the "Confirm Password" field
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');

    // Step 5: Click on the "Register" button
    fireEvent.press(getByText('Register'));

    // Step 6: Verify that the error message is displayed
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'That email address is invalid!'
      );
    }, { timeout: 10000 });
  }, 20000);
});