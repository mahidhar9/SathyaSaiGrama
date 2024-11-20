import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../../src/screens/Register';
import UserContext from '../../context/UserContext';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('../../src/auth/firebaseConfig', () => ({
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  sendEmailVerification: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/components/ApiRequest.js', () => ({
  getDataWithString: jest.fn().mockResolvedValue({
    data: [],
  }),
  isResident: jest.fn().mockResolvedValue(false),
  isEmployee: jest.fn().mockResolvedValue(false),
  isTestResident: jest.fn().mockResolvedValue(false),
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
  it("shows an error message when the email isn't registered", async () => {
    const { getByText, getByPlaceholderText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <Register navigation={mockNavigation} />
      </UserContext.Provider>
    );

    // Enter an invalid email
    fireEvent.changeText(getByPlaceholderText('Email Address'), 'invalid@example.com');
    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    // Press the register button
    const registerButton = getByText('Register');
    fireEvent.press(registerButton);

    // Check for the alert message
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'This email is not registered as a resident or employee. Please contact Admin'
      );
    });
  });
});