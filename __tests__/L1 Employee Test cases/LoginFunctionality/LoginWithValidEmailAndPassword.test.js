import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserContext from '../../../context/UserContext';
import Login from '../../../src/screens/Login';
import { Alert } from 'react-native';
import { encode } from 'base64-arraybuffer';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('base64-arraybuffer', () => ({
  encode: jest.fn().mockReturnValue('mockBase64Image'),
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



jest.spyOn(global, 'fetch').mockResolvedValue({
  ok: true,
  arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
json: jest.fn().mockResolvedValue({
    data: {
      Device_Tokens: 'mockDeviceToken123',
    },
  }),
});


jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn(),
  initializeAuth: jest.fn(() => ({
    currentUser: null,
  })),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {
      emailVerified: true,
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
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
  test('Verify that the user can log in with valid email and password', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <Login navigation={mockNavigation} />
      </UserContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email Address'), 'saitejads2000@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('FooterTab');
    }, { timeout: 10000 });
   
  }, 20000);
});