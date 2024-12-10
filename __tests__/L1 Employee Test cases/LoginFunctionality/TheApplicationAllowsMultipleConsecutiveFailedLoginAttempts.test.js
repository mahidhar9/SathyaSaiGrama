import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../../../src/screens/Login';
import UserContext from '../../../context/UserContext';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('../../../src/components/ApiRequest', () => ({
  getDataWithInt: jest.fn().mockResolvedValue({
    data: [{ Accommodation_Approval: 'APPROVED' }],
  }),
  getDataWithTwoInt: jest.fn().mockResolvedValue({
    data: [{ Accommodation_Approval: 'APPROVED' }],
  }),
  getDataWithString: jest.fn().mockResolvedValue({
    code: 3000,
    data: [{ Accommodation_Approval: 'APPROVED' }],
  }),
}));

jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn(),
  initializeAuth: jest.fn(() => ({
    currentUser: null,
  })),
  signInWithEmailAndPassword: jest.fn().mockRejectedValue({
    code: 'auth/invalid-email',
  }),
}));
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

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
  test('Verify that an error message is displayed for invalid email and password', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <Login navigation={mockNavigation} />
      </UserContext.Provider>
    );
    for(let i=0;i<5;i++){
    fireEvent.changeText(getByPlaceholderText('Email Address'), '19211314310mca2@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '12345678');
    fireEvent.press(getByText('Login'));
    }
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'That email address is invalid!'
      );
    }, { timeout: 10000 });
  }, 20000);
});