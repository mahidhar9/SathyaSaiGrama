import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../../../src/screens/Register';
import UserContext from '../../../context/UserContext';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
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
};

jest.mock('../../../src/components/ApiRequest', () => ({
  getDataWithString: jest.fn().mockResolvedValue({
    data: [{ ID: 'user123', Name_field: 'John Doe' }],
  }),
  getDataWithInt: jest.fn().mockResolvedValue({
    data: [{ Accommodation_Approval: 'APPROVED', Department_Approval: 'APPROVED' }],
  }),
  getDataWithTwoInt: jest.fn().mockResolvedValue({
    data: [{ Accommodation_Approval: 'APPROVED' }],
  }),
}));

jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn(),
  initializeAuth: jest.fn(() => ({
    currentUser: null,
  })),
  createUserWithEmailAndPassword: jest.fn().mockRejectedValue({
    code: 'auth/invalid-email',
    
  }),
  sendEmailVerification: jest.fn()
}));
describe('Register Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verify that user can Register with invalid mail formate', async () => {
    const validatePasswordMock = jest.fn().mockReturnValue(true);

    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <Register navigation={mockNavigation} validatePassword={validatePasswordMock} />
      </UserContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'Teja');

    fireEvent.changeText(getByPlaceholderText('Email Address'), 'saitejads2000@gmail.com');

    // Step 3: Enter a valid password in the "Password" field
    fireEvent.changeText(getByPlaceholderText('Password'), 'ValidPassword123!');

    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'ValidPassword123!');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("That email address is invalid!");
    }, { timeout: 10000 });
  }, 80000);
});